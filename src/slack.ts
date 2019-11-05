import * as got from "got"
import { slackUrl, slackToken } from "./secrets.json"
import * as shell from "shelljs"

interface Attachment {
	color?: string
	text?: string
	image_url?: string
	author_name?: string
	author_link?: string
	author_icon?: string
	footer?: string
	footer_icon?: string
	ts?: number
}

interface Payload {
	text: string
	attachments?: Array<Attachment>
	channel?: string
	username?: string
	icon_url?: string
	icon_emoji?: string
}

export function sendSlackMessage(payload: Payload) {
	return got(slackUrl, {
		method: "post",
		headers: {
			Accept: "application/json",
		},
		body: JSON.stringify(payload),
	})
}

const tennisChannel = "CPRA9165V"

export function uploadImage(args: { filePath: string; message: string }) {
	return shell.exec(
		`curl -F file=@${args.filePath} -F "initial_comment=${args.message}" -F channels=${tennisChannel} -H "Authorization: Bearer ${slackToken}" https://slack.com/api/files.upload`
	)
}
