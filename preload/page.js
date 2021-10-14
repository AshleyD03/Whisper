const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const Shell = require('node-powershell');
import { ffmpeg, ffmetadata } from './ffmpeg.js'

const yt_download = async (url = 'https://www.youtube.com/watch?v=TJBh_hj6DzE', path = './song.mp3', type = 'mp3') => {
	return new Promise((res, rej) => {

		if (type === 'mp4') {

			console.log('downloading mp4')
			const stream = ytdl(url, { filter: format.container === 'mp4' })
				.on('end', () => res())
				.pipe(fs.createWriteStream(path))
			return
		}

		if (type === 'mp3') {

			console.log('downloading mp3')
			const proc = new ffmpeg({
				source: ytdl(url, { filter: 'audioonly' })
			})
			proc.on('end', () => res())
			proc.saveToFile(path)
			return
		}

		return console.log('no file type')
	})
}

const applyMetaData = (path, data) => {
	return new Promise((res, rej) => {
		console.log('writing')
		ffmetadata.write(path, data, err => {
			if (err) rej(err)
			res()
		})
	})
}

const downloadSong = async (url, path, metadata) => {
	await yt_download(url, path)
	if (metadata) await applyMetaData(path, metadata)
	console.log('done')
}

const album = {
	path: './test',
	album: 'Ashley\'s Test',
	artist: 'Ashley',
	album_artist: 'Ashley the Creator',
	icon_name: 'icon.jpg',
	__tracks__: [
		{
			title: 'Mirror',
			url: 'https://youtu.be/PkiIPzG37vQ'
		},
		{
			title: 'Forget',
			url: 'https://www.youtube.com/watch?v=vOreqez4v9Y'
		},
		{
			title: 'Something Comforting',
			url: 'https://www.youtube.com/watch?v=-C-2AqRD8io'
		},
	]
}

// $itunes.LibraryPlaylist.addFile('C:\Users\adoel\code\ffmpeg-electron\test\Mirror.mp3')

const addAlbumToItunes = async (album) => {

	// Init Powershell & command list
	const ps = new Shell({
		executionPolicy: 'Bypass',
		noProfile: true
	});
	const commands = [
		'$itunes = New-Object  -ComObject iTunes.Application',
		'$itunes.createPlaylist'
	]

	// Add 'addFile' & 'AddArtworkFromFile' command for each song
	const iconPath = path.resolve(`${album.path}/${album.icon_name}`)
	album.__tracks__.forEach(song => {
		const mp3Path = path.resolve(`${album.path}/${song.title}.mp3`)
		let cmds = [
			`$track = $itunes.LibraryPlaylist.addFile(\'${mp3Path}\')`,
			`$track.tracks::item(1).AddArtworkFromFile(\'${iconPath}\')`
		]
		commands.push(...cmds)
	})

	// Run Commands
	commands.forEach(cmd => ps.addCommand(cmd))
	await ps.invoke();
}

applyMetaData('./test/Forget.mp3', { 'track': '0' }).then(() => console.log('done'))

//console.log(path.resolve('./test/Forget.mp3'))

/*
fs.mkdir(album.path, err => {
		album.__tracks__.forEach(async song => {
				await downloadSong(song.url, `${album.path}/${song.title}.mp3`, {
						title: song.title,
						artist: album.artist,
						album_artist: album.album_artist,
						album: album.album
				})
				console.log(`loaded ${song.title}`)
		})
})

*/


/*
downloadSong('https://www.youtube.com/watch?v=Ivrrt6oYxxc', './Her.mp3', {
		title: 'Her',
		artist: 'eery',
		album_artist: 'eery',
		album: 'Her'
})
*/