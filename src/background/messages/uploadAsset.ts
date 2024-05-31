import { gaslessFundAndUploadString } from "@/lib/gaslessFundAndUpload"
import type { PlasmoMessaging } from "@plasmohq/messaging"

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

const GATEWAY_BASE = (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/").endsWith("/")
	? process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/"
	: (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/") + "/";

const gaslessFundAndUploadData= async (data: string, tags: Tag[]): Promise<string> => {
	// obtain the server's public key
	console.log("gasless Fund and upload data", data, tags)
	const pubKeyRes = (await (await fetch(`${process.env.PLASMO_PUBLIC_BACKEND}/api/publicKey`)).json()) as unknown as {
		pubKey: string;
	};
	const pubKey = Buffer.from(pubKeyRes.pubKey, "hex");

	// Create a provider - this mimics the behaviour of the injected provider, i.e metamask
	const provider = {
		// for ETH wallets
		getPublicKey: async () => {
			return pubKey;
		},
		getSigner: () => {
			return {
				getAddress: () => pubKey.toString(), // pubkey is address for TypedEthereumSigner
				_signTypedData: async (
					_domain: never,
					_types: never,
					message: { address: string; "Transaction hash": Uint8Array },
				) => {
					const convertedMsg = Buffer.from(message["Transaction hash"]).toString("hex");
					console.log("convertedMsg: ", convertedMsg);
					const res = await fetch(`${process.env.PLASMO_PUBLIC_BACKEND}/api/signData`, {
						method: "POST",
						body: JSON.stringify({ signatureData: convertedMsg }),
					});
					const { signature } = await res.json();
					const bSig = Buffer.from(signature, "hex");
					// Pad & convert so it's in the format the signer expects to have to convert from.
					const pad = Buffer.concat([Buffer.from([0]), Buffer.from(bSig)]).toString("hex");
					return pad;
				},
			};
		},

		_ready: () => {},
	};

	// You can delete the lazyFund route if you're prefunding all uploads
	const fundTx = await fetch(`${process.env.PLASMO_PUBLIC_BACKEND}/api/lazyFund`, {
		method: "POST",
		body: data,
	});

	// Create a new WebIrys object using the provider created with server info.
	const network = process.env.NEXT_PUBLIC_NETWORK || "devnet";
	const token = process.env.NEXT_PUBLIC_TOKEN || "";

	const wallet = { name: "ethersv5", provider: provider };
	//@ts-ignore
	const irys = new WebIrys({ network, token, wallet });

	await irys.ready();

	console.log("Uploading irys=", irys);
    const tx = await irys.upload(data,{tags,})
	console.log(`Uploaded successfully. https://gateway.irys.xyz/${tx.id}`);

	return tx.id;
};

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("call uploadAsset successfully")

    console.log("account",req.body)

    await gaslessFundAndUploadString(req.body.content, req.body.tags)
    res.send({
      res: "ok"
    })
}

export default handler
