# La Corda live

Attendees scan a QR code, answer "What do you think about vinho verde?" with string pulls on their phones, and you decode the room's answers on a projector.

## Files

| File | What it is |
|---|---|
| `index.html` | The phone page: one question at a time, strings, wall, bells. |
| `screen.html` | The presenter screen: QR code, messenger's log, then "Decode the log" for the Duke's office. |
| `vox.js` | Question, channel name, threshold, codebook (the options on each step). Edit this one. |

## Put it online

**GitHub Pages**
1. Create a repository and upload the three files to the top level.
2. Settings, Pages, deploy from the `main` branch, root folder.
3. Open `https://<you>.github.io/<repo>/screen.html` on the projector. The QR code points at the phone page automatically.

**Vercel**
1. Put the three files in a folder and run `npx vercel --prod` there, or import the repository in the Vercel dashboard (framework preset: Other, no build command).
2. Open `https://<project>.vercel.app/screen.html` on the projector.

## Before the event

1. Change `TOPIC` in `vox.js` to a new random string. Anyone who knows it can read and send messages, so treat it like a password and do not publish it.
2. Test with two phones: send a message, check it appears on the screen, press "Decode the log".
3. Lower `THRESHOLD` in `vox.js` for a small room. With 20 people, "more than 5" per detail will rarely be reached.
4. Edit the options in `vox.js` if the room is different from what it assumes. Keep the same number of options in each list, and keep the codes.

## How messages travel

The phone sends only what the messenger hears: five bell codes, such as `10100 01001 00110 01100 00011`. No names, no text, and the strings that were pulled never leave the phone. The screen applies the secret crossing to read them. Messages go through the free public relay ntfy.sh and are kept there for about 12 hours.

Limits to know:
- ntfy.sh limits how fast one network can send. If a whole room shares one venue wifi, ask some people to use mobile data, or switch the transport (below).
- Anyone who learns `TOPIC` can add messages. Change it between events.

## Using your own backend

`vox.js` has two functions, `send(bells)` and `listen(onMessage, onStatus)`. Replace both to use Supabase, Firebase, or your own API. Nothing else needs to change.
