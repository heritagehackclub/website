# Heritage Hack Club

The website for Heritage Hack Club, a student-led project community connected to
Hack Club. Members can share projects, document their process, and receive clear
credit for their contributions.

## Development

Install dependencies and start the local server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To connect the profile application button to a Google Form, copy `.env.example`
to `.env.local` and set `NEXT_PUBLIC_PROFILE_APPLICATION_URL` to the public form
URL. Without that variable, the button opens a pre-addressed email.

## Quality checks

```bash
npm run check
npm run test:e2e
```

The site is built with Next.js, TypeScript, Theme UI, `@hackclub/theme`, and
`@hackclub/icons`.
