﻿--!strict
-- @name Analysis Scripts
-- @description Meant to run in the background and show world-space analysis data.
-- @author Another Axiom

metadata = {
	name = "Analysis Scripts",
	description = "Meant to run in the background and show world-space analysis data.",
	author = "Another Axiom",
	defaultKeybind = "",
}

alwaysTick = true

local drawTrails = false
local drawConnectingLines = false
local lineThickness = 4
local pointSize = 6
local lastFrame: ReplayFrame = nil

local function randomColor(seed: number): { number }
	math.randomseed(seed)
	return { hsvToRGB(math.random(), 1, 1) }
	-- return { math.random(), math.random(), math.random() }
end

local function colorFromSpeed(speed: number): { number }
	local slowest = Vec3.new(0, 1, 0)
	local fastest = Vec3.new(1, 0, 0)
	local speed01 = math.clamp(speed / 1000, 0, 1)
	local out = Vec3.lerp(slowest, fastest, speed01)
	return { out.x, out.y, out.z }
end

function hsvToRGB(h: number, s: number, v: number)
	local r, g, b

	local i = math.floor(h * 6)
	local f = h * 6 - i
	local p = v * (1 - s)
	local q = v * (1 - f * s)
	local t = v * (1 - (1 - f) * s)

	i = i % 6

	if i == 0 then
		r, g, b = v, t, p
	elseif i == 1 then
		r, g, b = q, v, p
	elseif i == 2 then
		r, g, b = p, v, t
	elseif i == 3 then
		r, g, b = p, q, v
	elseif i == 4 then
		r, g, b = t, p, v
	elseif i == 5 then
		r, g, b = v, p, q
	end

	return r, g, b
end

local function drawPointCloud()
	World.clear()
	local points = 0
	local replays = Replay.listLoaded()
	for i = 1, #replays do
		local replay = Replay.getByIndex(i)
		local resolution = 5 -- how many times per frame to sample
		for i = 1, replay:getDurationSeconds() * resolution do
			local frame = replay:getFrameAtTimeSeconds((i - 1) / resolution, true)
			for j = 1, #frame.players do
				local player = frame.players[j]
				local c = colorFromSpeed(player.velocity:length())
				World.drawPoint(player.head.position, c[1], c[2], c[3], pointSize, 0)
				points += 1
			end
		end
	end
	print("Total points drawn: " .. points)
end

local function drawAllLines()
	World.clear()
	local segments = 0
	local replays = Replay.listLoaded()
	for i = 1, #replays do
		local replay = Replay.getByIndex(i)
		if replay == nil then
			warn("Replay is nil. " .. i .. " of " .. #replays)
			return
		end
		local resolution = 1 -- how many times per frame to sample
		local lastFrame: ReplayFrame = nil
		for i = 1, replay:getDurationSeconds() * resolution do
			local frame = replay:getFrameAtTimeSeconds((i - 1) / resolution, true)
			for j = 1, #frame.players do
				local player = frame.players[j]
				local lastPlayer: ReplayPlayer = nil
				if lastFrame then
					lastPlayer = lastFrame:getPlayerById(player.playerId)
				end

				if lastPlayer then
					local c = colorFromSpeed(player.velocity:length())
					World.drawLine(lastPlayer.head.position, player.head.position, c[1], c[2], c[3], lineThickness, 0)
					segments = segments + 1
				end
			end
			lastFrame = frame
		end
	end
	print("Total line segments drawn: " .. segments)
end

function main()
	camera:followCamera(getCameraById("anotheraxiom.freecam"))
end

function onGui()
	Gui.text("" .. #Replay.listLoaded() .. " replays loaded\nLoad replays with the Replays window.")
	Gui.spacing()
	if Gui.button("Draw point cloud") then
		drawPointCloud()
	end
	pointSize = Gui.sliderFloat("Point Size", pointSize, 1, 50)
	Gui.spacing()
	if Gui.button("Draw Paths") then
		drawAllLines()
	end
	lineThickness = Gui.sliderFloat("Line Thickness", lineThickness, 1, 50)
	Gui.spacing()
	local newDrawTrails = Gui.checkbox("Draw Trails", drawTrails)
	if newDrawTrails ~= drawTrails then
		drawTrails = newDrawTrails
		if not drawTrails then
			World.clear()
		end
	end
	local newDrawConnectingLines = Gui.checkbox("Draw Player Connections", drawConnectingLines)
	if newDrawConnectingLines ~= drawConnectingLines then
		drawConnectingLines = newDrawConnectingLines
		if not drawConnectingLines then
			World.clear()
		end
	end
end

function tick(dt)
	if drawTrails then
		if #Replay.listLoaded() > 0 then
			local replay = Replay.getByIndex(1)
			local frame = replay:getCurrentFrame(false)
			for i = 1, #frame.players do
				local player = frame.players[i]
				local lastPlayer: ReplayPlayer = nil
				if lastFrame then
					lastPlayer = lastFrame:getPlayerById(player.playerId)
				end

				if lastPlayer then
					local c = colorFromSpeed(player.velocity:length())
					World.drawLine(lastPlayer.head.position, player.head.position, c[1], c[2], c[3], lineThickness, 10)
				end
			end
			for i = 1, #frame.balls do
				local ball = frame.balls[i]
				local lastBall: ReplayBall = nil
				if lastFrame then
					lastBall = lastFrame.balls[i]
				end

				if lastBall and (lastBall.transform.position - ball.transform.position):length() < 100 then
					World.drawLine(lastBall.transform.position, ball.transform.position, 0, 0, 1, lineThickness, 10)
				end
			end
			lastFrame = frame
			-- print("Drawing points")
		end
	end

	if drawConnectingLines then
		if #Replay.listLoaded() > 0 then
			local replay = Replay.getByIndex(1)
			local frame = replay:getCurrentFrame(true)
			World.clear()
			for i = 1, #frame.players do
				local player = frame.players[i]

				-- draw a line to every other player
				for j = 1, #frame.players do
					if i ~= j then
						local otherPlayer = frame.players[j]
						if (player.head.position - otherPlayer.head.position):length() < 5000 then
							local c = player.playerColor.teamLogoIndex == otherPlayer.playerColor.teamLogoIndex and { 0, 1, 0 } or { 1, 0, 0 }
							World.drawLine(player.head.position, otherPlayer.head.position, c[1], c[2], c[3], lineThickness, 0)
						end
					end
				end
			end
			for i = 1, #frame.balls do
				local ball = frame.balls[i]

				-- draw a line to every other player
				for j = 1, #frame.players do
					if i ~= j then
						local otherPlayer = frame.players[j]
						local distance = (ball.transform.position - otherPlayer.head.position):length()
						if distance < 5000 then
							local c = colorFromSpeed(distance / 2)
							World.drawLine(ball.transform.position, otherPlayer.head.position, c[1], c[2], c[3], lineThickness, 0)
						end
					end
				end
			end
			lastFrame = frame
		end
	end
end
