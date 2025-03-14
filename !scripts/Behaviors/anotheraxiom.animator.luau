--!strict
metadata = {
	name = "Animator",
	description = "A camera used to define camera animations",
	author = "Another Axiom",
	defaultKeybind = "M",
}

camera.positionSmoothing = 0
camera.rotationSmoothing = 0
camera.fieldOfViewSmoothing = 0

type propertySpline = {
	properties: { Vec2 },
	lut: { Vec2 },
}

type Curve = {
	p1: Vec2,
	p2: Vec2,
	p3: Vec2,
	p4: Vec2,
	lut: { number },
}

type AnimationRow = {
	name: string,
	interpolationMode: number,
	isGraphOpen: boolean,
	spline: propertySpline,
}

local properties = {
	"position.x",
	"position.y",
	"position.z",
	"roll",
	"pitch",
	"yaw",
	"field of view",
	"depth of field",
}

local interpModes = {
	"Global Default",
	"Linear",
	"Smooth",
	"Custom",
}
local globalInterpSettings = {
	smoothing = 1,
}
local propertySelector = 1

local timelineStart = 0
local timelineEnd = 20
local snapTimeInterval = 0.05
local rangeStartTime = 0
local rangeEndTime = 5
local playbackTime = 0

local lutPointsPerCurve = 20
local visualizeLut = true

local recording = false
local recordOneKey = false
local lastRecordedProperties = {}
local animating = false
local editing = false
local keyframeCache = {} -- save a list of the last few keyframe states to allow for undo
local newReplayFileName = ""

local rows = config.rows or {}

type Animation = {
	timelineStart: number,
	timelineEnd: number,
	globalSmoothing: number,
	replays: { string },
	rows: { AnimationRow },
}
local topLevelKeyframes = { keyframes = {}, snapshot = {} }
function onGui()
	if Gui.collapsingHeader("Controls") then
		Gui.indent()
		Gui.text("Toggle playback:     Spacebar")
		Gui.unindent()
	end
	if Gui.collapsingHeader("Timeline Settings") then
		Gui.indent()
		local timelineStartEnd = Gui.dragFloat2("Playback start/end", Vec2.new(timelineStart, timelineEnd), 0.1, 0, timelineEnd + 10)
		timelineStart = timelineStartEnd.x
		timelineEnd = timelineStartEnd.y
		if timelineStart >= timelineEnd - 1 then
			timelineEnd = timelineEnd + 1
		end
		snapTimeInterval = Gui.dragFloat("Snap Time Interval", snapTimeInterval, 0.01, 0, 2)
		Gui.separatorText("Temporary")

		camera.positionSmoothing = Gui.sliderFloat("positionSmoothing", camera.positionSmoothing, 0, 3)
		camera.rotationSmoothing = Gui.sliderFloat("rotationSmoothing", camera.rotationSmoothing, 0, 3)
		Gui.unindent()
	end
	Gui.newLine()
	if animating then
		if Gui.button(Icon.Pause) then
			animating = false
		end
	else
		if Gui.button(Icon.Play) then
			play()
		end
	end
	Gui.sameLine()
	if editing then
		if Gui.button(Icon.PenSquare) then
			editing = false
			recording = false
		end
		Gui.setItemTooltip("Exit freecam editing mode")
	else
		if Gui.button(Icon.PencilAlt) then
			editing = true
		end
		Gui.setItemTooltip("Enter freecam editing mode")
	end

	Gui.sameLine()
	-- Removed for now
	--[[if recording then
		if Gui.button(Icon.Square) then
			recording = false
		end
	else
		if Gui.button(Icon.Circle) then
			recording = true
			editing = true
		end
	end]]
	Gui.sameLine()
	if Gui.button(Icon.Key) then
		recordOneKey = true
	end
	Gui.setItemTooltip("Record current keyframe")

	if Gui.collapsingHeader("Global Interpolation Settings") then
		globalInterpSettings.smoothing = Gui.sliderFloat("Smoothing", globalInterpSettings.smoothing, 0, 1)
	end

	if Gui.beginTable("table", 3) then
		Gui.tableSetupColumn("Name")
		Gui.tableSetupColumn("Controls")
		Gui.tableSetupColumn("Timeline")
		Gui.tableHeadersRow()

		Gui.tableNextColumn()
		Gui.tableNextColumn()
		if Gui.beginCombo("##property select", properties[propertySelector]) then
			for i = 1, #properties do
				local isPropertyThereAlready = propertyExists(properties[i])
				if isPropertyThereAlready then
					Gui.beginDisabled()
				end
				if Gui.selectable(properties[i], i == propertySelector) then
					propertySelector = i
				end
				if isPropertyThereAlready then
					Gui.endDisabled()
				end
			end
			Gui.endCombo()
		end
		Gui.sameLine()
		local isPropertyThereAlready = propertyExists(properties[propertySelector])
		if isPropertyThereAlready then
			Gui.beginDisabled()
		end
		if Gui.button(Icon.Plus .. " Add Property") then
			table.insert(rows, {
				name = properties[propertySelector],
				interpolationMode = 1,
				isGraphOpen = false,
				spline = {
					properties = { Vec2.new(0, 0), Vec2.new(0, 0), Vec2.new(0, 0) },
					lut = nil,
				},
			})
			propertySelector = 1
			-- set the property selector to the next avalable property
			for i = 1, #properties do
				if not propertyExists(properties[i]) then
					propertySelector = i
					break
				end
			end
		end

		if isPropertyThereAlready then
			Gui.endDisabled()
		end

		newReplayFileName = Gui.inputText("##New Replay Name", newReplayFileName)
		Gui.sameLine()
		if Gui.button(Icon.Plus .. " Add Replay") then
			if findIndexInList(Replay.listAll(), newReplayFileName) > 0 then
				print("adding replay: " .. newReplayFileName)
				table.insert(properties, newReplayFileName)
				table.insert(rows, {
					name = newReplayFileName,
					interpolationMode = 1,
					isGraphOpen = false,
					spline = {
						properties = { Vec2.new(0, 0) },
						lut = nil,
					},
				})
			end
		end

		Gui.tableNextColumn()
		local range = Gui.rangeSlider("timelineRange", Vec2.new(rangeStartTime, rangeEndTime), timelineStart, timelineEnd)
		rangeStartTime = range.x
		rangeEndTime = range.y
		playbackTime = Gui.timeline("timeline", playbackTime, rangeStartTime, rangeEndTime, snapTimeInterval)

		Gui.tableNextColumn()

		for i = 1, #rows do
			-- Property name
			if Gui.button("X" .. "##" .. i) then
				table.remove(rows, i)
			else
				Gui.sameLine()
				Gui.text(rows[i].name)
				Gui.tableNextColumn()

				-- Property Controls
				if Gui.beginCombo("##" .. i, interpModes[rows[i].interpolationMode]) then
					for j = 1, #interpModes do
						if Gui.selectable(interpModes[j], j == rows[i].interpolationMode) then
							rows[i].interpolationMode = j
						end
					end
					Gui.endCombo()
				end
				Gui.sameLine()
				if Gui.button(Icon.ChartLine .. "##" .. i) then
					rows[i].isGraphOpen = not rows[i].isGraphOpen
				end
				Gui.sameLine()
				local valueAtPlayhead = evalSpline(playbackTime, rows[i].spline)
				Gui.text(string.format("%.2f", valueAtPlayhead))
				Gui.sameLine()
				-- Add a keyframe
				local hoveredKf = hoveredKeyframe(rows[i].spline, playbackTime)
				if hoveredKf == -1 then
					if Gui.button(Icon.Plus .. "##" .. i) then
						writePoint(rows[i].spline, playbackTime, valueAtPlayhead)
					end
				else
					if Gui.button(Icon.Minus .. "##" .. i) then
						removePoint(rows[i].spline, hoveredKf)
					end
				end

				Gui.tableNextColumn()

				if interpModes[rows[i].interpolationMode] == "Custom" and rows[i].isGraphOpen then
					Gui.beginDisabled()
				end
				local onCurvePoints = Gui.keyframeRow(
					"keyframeRow" .. i,
					getKeyframesFromGraph(rows[i].spline.properties),
					playbackTime,
					rangeStartTime,
					rangeEndTime,
					snapTimeInterval
				)
				if interpModes[rows[i].interpolationMode] == "Custom" and rows[i].isGraphOpen then
					Gui.endDisabled()
				end

				updateGraphPoints(onCurvePoints, rows[i].spline.properties, rows[i].interpolationMode)
				if rows[i].isGraphOpen then
					if interpModes[rows[i].interpolationMode] ~= "Custom" then
						Gui.beginDisabled()
					end
					local graphOutput = prependFirstPoint(
						Gui.graphEditor(
							"graphEditor" .. i,
							sortByXBezier(ignoreFirstPoint(rows[i].spline.properties)),
							playbackTime,
							rangeStartTime,
							rangeEndTime,
							snapTimeInterval
						)
					)
					if interpModes[rows[i].interpolationMode] == "Custom" then
						--print("length before: " .. #rows[i].spline.properties)
						--print("length after: " .. #graphOutput)
						rows[i].spline.properties = graphOutput
					end
					if interpModes[rows[i].interpolationMode] ~= "Custom" then
						Gui.endDisabled()
					end
				end
				Gui.tableNextRow()
				Gui.tableNextColumn()
			end
		end
		Gui.endTable()
	end

	if Gui.button("Reset All") then
		load(config)
	end
	Gui.sameLine()
	if Gui.button(Icon.Save) then
		saveToConfig()
	end
	Gui.setItemTooltip("Save")
	Gui.sameLine()
	if Gui.button("Clear All") then
		rows = {}
	end
end

function hoveredKeyframe(spline: propertySpline, time: number): number
	local onCurvePoints = getOnCurveSplinePoints(spline.properties)
	if spline == nil or #onCurvePoints < 1 then
		return -1
	end
	local left = 1
	local right = #onCurvePoints

	while left <= right do
		local mid = (left + right) // 2
		if onCurvePoints[mid].x == time then
			return mid
		elseif onCurvePoints[mid].x < time then
			left = mid + 1
		else
			right = mid - 1
		end
	end
	if left <= #onCurvePoints and left >= 1 and math.abs(onCurvePoints[left].x - time) < snapTimeInterval / 2 then
		return left
	elseif right <= #onCurvePoints and right >= 1 and math.abs(onCurvePoints[right].x - time) < snapTimeInterval / 2 then
		return right
	end
	return -1
end

local function lerp(a: number, b: number, t: number): number
	return a * (1.0 - t) + b * t
end

-- Use a lookup table to efficiently approximate a spline's value at a given time (x)
function evalSpline(time: number, spline: propertySpline): number
	if spline.lut == nil or #spline.lut == 0 then
		spline.lut = updateSplineLut(spline)
	end
	if #spline.lut == 0 then
		return 0
	end
	if spline.lut[1].x >= time then
		return spline.lut[1].y
	elseif spline.lut[#spline.lut].x <= time then
		if #spline.lut > 1 then
			return spline.lut[#spline.lut - 1].y
		end
		return spline.lut[#spline.lut].y
	end

	-- linear search
	for i = 1, #spline.lut - 1, 1 do
		-- Check if our time is between the two adjacent points
		if spline.lut[i].x <= time and spline.lut[i + 1].x > time then
			local alpha = (time - spline.lut[i].x) / (spline.lut[i + 1].x - spline.lut[i].x)
			local interpValue = lerp(spline.lut[i].y, spline.lut[i + 1].y, alpha)
			return interpValue
		end
	end
	return 0

	--[[ binary search
	local lowBound = getClosestLutPoint(spline, time)
	local alpha = (time - spline.lut[lowBound].x) / (spline.lut[lowBound + 1].x - spline.lut[lowBound].x)
	local interpValue = lerp(spline.lut[lowBound].y, spline.lut[lowBound + 1].y, alpha)
	return interpValue]]
end

function getClosestLutPoint(spline: propertySpline, time: number): number -- closest without going over if possible
	local left = 1
	local right = #spline.lut

	while left <= right do
		local mid = (left + right) // 2
		if spline.lut[mid].x == time then
			return mid
		elseif spline.lut[mid].x < time then
			left = mid + 1
		else
			right = mid - 1
		end
	end
	return left
end

function updateSplineLut(spline: propertySpline): { Vec2 }
	local lutPoints = {}
	local sortedProperties = sortByX(spline.properties)

	if #sortedProperties <= 3 then
		table.insert(lutPoints, Vec2.new(sortedProperties[1].x, sortedProperties[1].y))
	end
	-- Loop through each curve
	for i = 2, #sortedProperties - 4, 3 do
		local p1 = sortedProperties[i]
		local p2 = sortedProperties[i + 1]
		local p3 = sortedProperties[i + 2]
		local p4 = sortedProperties[i + 3]

		for j = 1, lutPointsPerCurve do
			local t = j / lutPointsPerCurve
			local point =
				Vec2.lerp(Vec2.lerp(Vec2.lerp(p1, p2, t), Vec2.lerp(p2, p3, t), t), Vec2.lerp(Vec2.lerp(p2, p3, t), Vec2.lerp(p3, p4, t), t), t)
			table.insert(lutPoints, point)
		end
	end
	return lutPoints
end

function updateAllSplineLuts()
	for i = 1, #rows do
		rows[i].spline.lut = updateSplineLut(rows[i].spline)
	end
end

function sortByX(arr: { Vec2 }): { Vec2 }
	local copy = {}
	for i = 1, #arr do
		copy[i] = Vec2.new(arr[i].x, arr[i].y)
	end

	for i = 2, #copy do
		local key = copy[i]
		local j = i - 1

		while j > 0 and copy[j].x > key.x do
			copy[j + 1] = copy[j]
			j = j - 1
		end
		copy[j + 1] = key
	end
	return copy
end
function sortByXBezier(arr: { Vec2 }): { Vec2 } -- Sorts every 3rd point, with adjacent points following.
	local points = {}
	for i = 1, #arr do
		points[i] = Vec2.new(arr[i].x, arr[i].y)
	end

	for i = 4, #points, 3 do
		local key = points[i]
		local key1 = (#points > i) and points[i + 1] or points[i]
		local key2 = (i > 2) and points[i - 1] or points[i]
		local j = i - 3

		while j >= 1 and points[j].x > key.x do
			points[j + 3] = points[j]
			if #points > j + 3 then
				points[j + 4] = points[j + 1]
			end
			points[j + 2] = (j > 1) and points[j - 1] or points[j]
			j = j - 3
		end
		points[j + 3] = key
		if #points > j + 3 then
			points[j + 4] = key1
		end
		points[j + 2] = key2
	end
	return points
end

-- Function to check if a list contains a specific value. If it exists, it returns the index
function findIndexInList(list, value)
	for i, v in ipairs(list) do
		if v == value then
			return i
		end
	end
	return -1
end

-- Find the index of the first instance of a replay that is loaded
function findReplayIndex(name: string): number
	for i, v in ipairs(Replay.listLoaded()) do
		-- check if string (file path) ends with the replay name
		if v:sub(-#name) == name then
			return i
		end
	end
	return -1
end

function ignoreFirstPoint(points: { Vec2 }): { Vec2 }
	local smallerList = {}
	for i = 2, #points do
		table.insert(smallerList, points[i])
	end
	return smallerList
end

function prependFirstPoint(points: { Vec2 }): { Vec2 }
	local largerList = { Vec2.zeroVector }
	--table.insert(largerList, otherList[1])
	for i = 1, #points do
		table.insert(largerList, points[i])
	end
	return largerList
end

function listOfOnCurveCtrlPointsToGraph(string, points): propertySpline
	-- sets up linear control points
	local biggerList = {}
	for i = 1, #points - 2 do
		table.insert(biggerList, points[i])
		table.insert(biggerList, points[i])
		table.insert(biggerList, points[i + 1])
	end
	table.insert(biggerList, points[#points])
	return { properties = biggerList, lut = {} }
end

function getKeyframesFromGraph(points: { Vec2 }): { Vec2 }
	if points == nil then
		return {}
	end

	local smallerList = {}
	for i = 2, #points, 3 do
		table.insert(smallerList, points[i])
	end
	return smallerList
end

function getOnCurveSplinePoints(splinePoints: { Vec2 }): { Vec2 }
	local onCurvePoints = {}
	for i = 1, #splinePoints, 3 do
		table.insert(onCurvePoints, splinePoints[i])
	end
	return onCurvePoints
end

function updateGraphPoints(onCurvePoints: { Vec2 }, graphPoints: { Vec2 }, currentMode: number)
	if graphPoints == nil then
		graphPoints = {}
	end
	local offset = 1
	if interpModes[currentMode] == "Global Default" then
		local sortedIndices = {}
		for i = 1, #onCurvePoints do
			table.insert(sortedIndices, i)
		end
		table.sort(sortedIndices, function(a, b)
			return onCurvePoints[a].x < onCurvePoints[b].x
		end)
		local tension = 0.33 * globalInterpSettings.smoothing
		for i = 1, #onCurvePoints do
			local j = sortedIndices[i]
			if i < 2 then
				-- left edge (no easing)
				graphPoints[j * 3 - 1 + offset] = onCurvePoints[j]
			elseif i > #onCurvePoints - 1 then
				-- right edge (easing)
				local vec = Vec2.new(onCurvePoints[sortedIndices[i]].x - onCurvePoints[sortedIndices[i - 1]].x, 0)
				graphPoints[j * 3 - 3 + offset] = onCurvePoints[j] - vec * tension
			else
				-- everywhere in the middle
				local leftCurveWidth = onCurvePoints[j].x - onCurvePoints[sortedIndices[i - 1]].x
				local rightCurveWidth = onCurvePoints[sortedIndices[i + 1]].x - onCurvePoints[j].x
				local vec = onCurvePoints[sortedIndices[i + 1]] - onCurvePoints[sortedIndices[i - 1]]
				local a = lerp(0, 1, leftCurveWidth / (leftCurveWidth + rightCurveWidth))
				graphPoints[j * 3 - 3 + offset] = onCurvePoints[j] - vec * tension * a -- left
				graphPoints[j * 3 - 1 + offset] = onCurvePoints[j] + vec * tension * (1 - a) -- right
			end
			graphPoints[i * 3 - 2 + offset] = onCurvePoints[i] -- on curve
		end
		graphPoints[#graphPoints] = onCurvePoints[#onCurvePoints]
	elseif interpModes[currentMode] == "Linear" then
		for i = 1, #onCurvePoints - 1 do
			graphPoints[i * 3 - 1 + offset] = onCurvePoints[i]
			graphPoints[i * 3 + offset] = onCurvePoints[i + 1]
			graphPoints[i * 3 - 2 + offset] = onCurvePoints[i]
		end
		graphPoints[#graphPoints] = onCurvePoints[#onCurvePoints]
	elseif interpModes[currentMode] == "Smooth" then
		local sortedIndices = {}
		for i = 1, #onCurvePoints do
			table.insert(sortedIndices, i)
		end
		table.sort(sortedIndices, function(a, b)
			return onCurvePoints[a].x < onCurvePoints[b].x
		end)
		local tension = 0.33
		for i = 1, #onCurvePoints do
			local j = sortedIndices[i]
			if i < 2 then
				-- left edge (no easing)
				graphPoints[j * 3 - 1 + offset] = onCurvePoints[j]
			elseif i > #onCurvePoints - 1 then
				-- right edge (easing)
				local vec = Vec2.new(onCurvePoints[sortedIndices[i]].x - onCurvePoints[sortedIndices[i - 1]].x, 0)
				graphPoints[j * 3 - 3 + offset] = onCurvePoints[j] - vec * tension
			else
				-- everywhere in the middle
				local leftCurveWidth = onCurvePoints[j].x - onCurvePoints[sortedIndices[i - 1]].x
				local rightCurveWidth = onCurvePoints[sortedIndices[i + 1]].x - onCurvePoints[j].x
				local vec = onCurvePoints[sortedIndices[i + 1]] - onCurvePoints[sortedIndices[i - 1]]
				local a = lerp(0, 1, leftCurveWidth / (leftCurveWidth + rightCurveWidth))
				graphPoints[j * 3 - 3 + offset] = onCurvePoints[j] - vec * tension * a -- left
				graphPoints[j * 3 - 1 + offset] = onCurvePoints[j] + vec * tension * (1 - a) -- right
			end
			graphPoints[i * 3 - 2 + offset] = onCurvePoints[i] -- on curve
		end
		graphPoints[#graphPoints] = onCurvePoints[#onCurvePoints]
	elseif interpModes[currentMode] == "Custom" then
	end
end

function propertyExists(property: string): boolean
	for i = 1, #rows do
		if rows[i].name == property then
			return true
		end
	end
	return false
end

function writePoint(spline: propertySpline, time: number, newValue: number)
	-- Overwrite value if the point already exists and adjust control points as necessary
	for i = 1, #spline.properties, 3 do
		if math.abs(spline.properties[i].x - time) < snapTimeInterval then
			local deltaY = newValue - spline.properties[i].y
			spline.properties[i] = Vec2.new(spline.properties[i].x, spline.properties[i].y + deltaY)
			if i > 1 then
				spline.properties[i - 1] = Vec2.new(spline.properties[i - 1].x, spline.properties[i - 1].y + deltaY)
			end
			if i < #spline.properties then
				spline.properties[i + 1] = Vec2.new(spline.properties[i + 1].x, spline.properties[i + 1].y + deltaY)
			end
			spline.properties = sortByXBezier(spline.properties)
			return
		end
	end

	-- Add new point if it doesn't already exist
	table.insert(spline.properties, Vec2.new(time, newValue))
	table.insert(spline.properties, Vec2.new(time, newValue))
	table.insert(spline.properties, Vec2.new(time, newValue))
	spline.properties = sortByXBezier(spline.properties)
	spline.lut = updateSplineLut(spline)
end

function removePoint(spline: propertySpline, index: number)
	local adjustedIndex = 3 * index - 2
	table.remove(spline.properties, adjustedIndex)
	if adjustedIndex <= #spline.properties then
		table.remove(spline.properties, adjustedIndex)
	end
	if adjustedIndex > 1 then
		table.remove(spline.properties, adjustedIndex - 1)
	end
	spline.lut = updateSplineLut(spline)
end

function saveToConfig()
	local configRows = {}
	for i = 1, #rows do
		local propertiesData = {}
		for j = 1, #rows[i].spline.properties do
			table.insert(propertiesData, { x = rows[i].spline.properties[j].x, y = rows[i].spline.properties[j].y })
		end
		table.insert(configRows, {
			name = rows[i].name,
			interpolationMode = rows[i].interpolationMode,
			isGraphOpen = rows[i].isGraphOpen,
			spline = {
				properties = propertiesData,
				lut = {},
			},
		})
	end
	config.timelineStart = timelineStart
	config.timelineEnd = timelineEnd
	config.globalSmoothing = globalInterpSettings.smoothing
	config.replays = {}
	config.rows = configRows

	print(config)
	saveConfig()
	print("Saved " .. #configRows .. " rows to config")
end

function load(anim)
	print("anim to load:")
	print(anim)
	local copiedRows = {}
	for i = 1, #anim.rows do
		local copiedProperties = {}
		for j = 1, #anim.rows[i].spline.properties do
			table.insert(copiedProperties, Vec2.new(anim.rows[i].spline.properties[j].x, anim.rows[i].spline.properties[j].y))
		end
		table.insert(copiedRows, {
			name = anim.rows[i].name,
			interpolationMode = anim.rows[i].interpolationMode,
			isGraphOpen = anim.rows[i].isGraphOpen,
			spline = {
				properties = copiedProperties,
				lut = {},
			},
		})
	end
	timelineStart = anim.timelineStart
	timelineEnd = anim.timelineEnd
	globalInterpSettings.smoothing = anim.globalSmoothing
	--config.replays = {}
	rows = copiedRows
	print("loading rows:")
	print(rows)
end

function tick(dt)
	World.clear()
	if Input.getKeyDown(Input.Key.SpaceBar) then
		if animating then
			animating = false
		else
			play()
		end
	end
	if animating then
		playbackTime += dt
	end
	local cameraRotEuler = camera.rotation:euler()

	for i = 1, #rows do
		-- apply spline data
		local name = rows[i].name
		if name == "position.x" then
			camera.position = Vec3.new(updateProperty(i, camera.position.x), camera.position.y, camera.position.z)
		elseif name == "position.y" then
			camera.position = Vec3.new(camera.position.x, updateProperty(i, camera.position.y), camera.position.z)
		elseif name == "position.z" then
			camera.position = Vec3.new(camera.position.x, camera.position.y, updateProperty(i, camera.position.z))
		elseif name == "roll" then
			if recordOneKey or recording then
				cameraRotEuler.x =
					updateProperty(i, returnClosest(evalSpline(playbackTime, rows[i].spline), cameraRotEuler.x, cameraRotEuler.x - 360))
			else
				cameraRotEuler.x = updateProperty(i, cameraRotEuler.x)
			end
		elseif name == "pitch" then
			if recordOneKey or recording then
				cameraRotEuler.y =
					updateProperty(i, returnClosest(evalSpline(playbackTime, rows[i].spline), cameraRotEuler.y, cameraRotEuler.y - 360))
			else
				cameraRotEuler.y = updateProperty(i, cameraRotEuler.y)
			end
		elseif name == "yaw" then
			if recordOneKey or recording then
				cameraRotEuler.z =
					updateProperty(i, returnClosest(evalSpline(playbackTime, rows[i].spline), cameraRotEuler.z, cameraRotEuler.z - 360))
			else
				cameraRotEuler.z = updateProperty(i, cameraRotEuler.z)
			end
		elseif name == "field of view" then
			camera.fieldOfView = updateProperty(i, camera.fieldOfView)
		elseif name == "depth of field" then
			postProcessSettings.depthOfFieldFocalDistance = updateProperty(i, postProcessSettings.depthOfFieldFocalDistance)
		else
			-- load replay
			if findIndexInList(Replay.listAll(), name) > 0 then
				local replay
				local replayIndex = findReplayIndex(name)
				-- TODO: currently does not support the same replay being loaded more than once
				if replayIndex == -1 then
					replay = Replay.load(newReplayFileName)
				else
					replay = Replay.getByIndex(replayIndex)
				end
				--if not editing then
				replay:setPlaybackTimeSeconds(updateProperty(i, replay:getPlaybackTimeSeconds()))
				--end
			end
		end
	end

	camera.rotation = Quat.fromEuler(cameraRotEuler.x, cameraRotEuler.y, cameraRotEuler.z)
	if animating or not editing then
		camera:followCamera(nil)
		editing = false
		recording = false
	else
		local freecam = getCameraById("anotheraxiom.freecam")
		camera:followCamera(freecam)
	end

	-- Visualize LUT
	if editing and visualizeLut and #rows >= 3 then
		local xSpline = getProperty("position.x").spline
		local ySpline = getProperty("position.y").spline
		local zSpline = getProperty("position.z").spline
		local lastPoint = Vec3.new(evalSpline(0, xSpline), evalSpline(0, ySpline), evalSpline(0, zSpline))
		for i = 2, 50 do
			local t = i / 50 * (timelineEnd - timelineStart) + timelineStart
			local vec = Vec3.new(evalSpline(t, xSpline), evalSpline(t, ySpline), evalSpline(t, zSpline))
			World.drawLine(lastPoint, vec, 1, 0, 1, 10, 0)
			lastPoint = vec
		end
	end

	local rowsCopy = {}
	for i = 1, #rows do
		local rowCopy = {
			name = rows[i].name,
			interpolationMode = rows[i].interpolationMode,
			isGraphOpen = rows[i].isGraphOpen,
			spline = { properties = {}, lut = nil },
		}
		for j = 1, #rows[i].spline.properties do
			table.insert(rowCopy.spline.properties, Vec2.new(rows[i].spline.properties[j].x, rows[i].spline.properties[j].y))
		end
		table.insert(rowsCopy, rowCopy)
	end
	recordOneKey = false
end

function getProperty(name: string)
	for i = 1, #rows do
		if rows[i].name == name then
			return rows[i]
		end
	end
	return
end

function returnClosest(target: number, v1: number, v2: number)
	if math.abs(target - v1) <= math.abs(target - v2) then
		return v1
	else
		return v2
	end
end

function updateProperty(index: number, currentValue: number): number
	local name = rows[index].name
	if recordOneKey or (recording and lastRecordedProperties[name] ~= currentValue) then
		writePoint(rows[index].spline, playbackTime, currentValue)
		lastRecordedProperties[name] = currentValue
		rows[index].spline.lut = updateSplineLut(rows[index].spline)
		return currentValue
	end
	local newValue = evalSpline(playbackTime, rows[index].spline)
	if newValue ~= currentValue and not animating then
		rows[index].spline.lut = updateSplineLut(rows[index].spline)
	end
	return newValue
end

function play()
	animating = true
	for i = 1, #rows do
		rows[i].spline.lut = updateSplineLut(rows[i].spline)
	end
end

updateAllSplineLuts()
