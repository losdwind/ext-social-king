

# Social King: Content Trading & Investing Platform
Social King leverages the principle that successful content behaves like successful memes, transforming the way we trade and invest in social media content.

## Features
- Content Trading: Buy and sell rights to social media posts and content from platforms like Twitter and YouTube.
- Commission Structure: Implements a commission fee structure where 1% goes to the creator, 3% to the author, and 1% to the Social King platform, incentivizing content creation and platform growth.
- Chrome Extension: Features a convenient Chrome extension that embeds buy/sell buttons directly on Twitter and YouTube interfaces, alongside a browser side panel that highlights trending posts.
## Tech Stack
- ERC1155 (Ethereum): Utilizes the ERC1155 token standard for efficient multi-token management.
- Chainlink: Integrates Chainlink for decentralized oracle functions and real-time data feeds to ensure accurate pricing and secure account bindings.
- TheGraph: Leverages TheGraph for indexing and querying blockchain data, enhancing data retrieval efficiency.
- Plasmo Framework: Employs the Plasmo browser extension framework for robust, scalable extension development.


## Getting Started

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
