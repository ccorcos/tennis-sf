import { withBrowser } from "./browser"
import { email, password } from "./secrets.json"
import * as path from "path"
import { uploadImage } from "./slack"

const headless = true
const glenParkUrl = "https://spotery.com/spot/3333270"

/**
 * Date can should be a string formatted "MM/DD/YYYY".
 * For example: `moment().add(1, "week").format("MM/DD/YYYY")`
 */
export async function reserveTennisCourt(date: string) {
	return withBrowser(async browser => {
		console.log("Starting program at", new Date())
		console.log("Reserving for date", date)

		// Go to the tennis court.
		console.log("Visiting", glenParkUrl)
		await browser.visit(glenParkUrl)
		await browser.findText("Request Spot").click()

		// Log in.
		console.log("Logging in as", email)
		// Wait for auth0 to load.
		await browser.getClassName("auth0-lock-view-content")
		// Wait for the animation to reveal the inputs.
		await wait(2000)
		await browser.find("input[type=email]").type(email)
		await browser.find("input[type=password]").type(password)
		await browser.find("button[type=submit]").click()

		// Request spot again.
		await browser.findText("Request Spot").click()

		// Date
		console.log("Reserving for", date)
		await browser
			.find("input[name='pt1:idDate0']")
			.type(date)
			.enter()

		// Wait for the options to load.
		await wait(2000)

		const timeElmSelector = "select[name='pt1:socDateFrom0']"
		const optionElements = await browser.find(timeElmSelector).findAll("option")
		const results = await Promise.all(
			optionElements.map(async element => {
				const disabled = (await element.getAttribute("disabled")) === "true"
				const value = await element.getAttribute("value")
				const time = await element.getText()
				return { disabled, value, time, element }
			})
		)

		if (results.length === 0) {
			throw new Error(`No time available for ${date}.`)
		}

		const validOptions = results
			.filter(({ disabled }) => !disabled)
			.filter(({ time }) => time.endsWith("PM"))
			.filter(({ time }) => time[0] !== "1")
			// .filter(({ time }) => time >= "06")
			.filter(({ time }) => time >= "07")

		console.log(
			"Time options are\n",
			validOptions.map(({ time }) => time).join("\n- ")
		)

		const optionsAround7 = validOptions.filter(({ time }) =>
			time.startsWith("07")
		)
		const optionsNotAround7 = validOptions.filter(
			({ time }) => !time.startsWith("07")
		)

		const optionPriorities = [...optionsAround7, ...optionsNotAround7]
		const bestOption = optionPriorities[0]
		if (!bestOption) {
			validOptions.join(",")
			throw new Error(
				[
					"Could not find a time around 7pm to reserve.",
					`Available options for ${date} are:`,
					...results.filter(({ disabled }) => !disabled).map(v => v.time),
				].join("\n")
			)
		}

		const { value, time } = bestOption
		console.log("Selecting time", time)
		await browser.find(timeElmSelector).click()
		await browser
			.find(timeElmSelector)
			.find(`option[value='${value}']`)
			.click()

		await wait(5000)
		await browser.findText("BOOK NOW").click()

		// Wait for it to be booked.
		await browser.findText("Booked")
		console.log("Booked!")
		const fileName = `reservation-${date}-${time}.png`.replace(/[\/ :]/g, "-")
		const filePath = path.resolve("/tmp/" + fileName)
		await browser.saveScreenshotPng(filePath)
		console.log("Reservation", filePath)

		await uploadImage({
			filePath,
			message: `Reserved for ${date} at ${time}.`,
		})

		return { date, time }
	}, headless)
}

function wait(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
