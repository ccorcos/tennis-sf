import { Request, Response } from "express"
import * as moment from "moment-timezone"
import { reserveTennisCourt } from "./tennis"
import { sendSlackMessage } from "./slack"

export default async function main(req: Request, res: Response) {
	// Reserve for one week later.
	const date = moment()
		.tz("America/Los_Angeles")
		.add(1, "week")
		.format("MM/DD/YYYY")

	try {
		const result = await reserveTennisCourt(date)
		res.status(200).send(JSON.stringify(result, null, 2))
	} catch (error) {
		await sendSlackMessage({
			text: `Failed to reserve a tennis court on ${date}: "${error.message}"`,
		})
		res.status(400).send(error.message)
	}
}
