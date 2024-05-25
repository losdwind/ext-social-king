import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // GraphQL query to fetch tags from Arweave
  const query = `
  query {
    transaction(id: "${req.body.transactionId}") {
      id
      tags {
        name
        value
      }
      data {
        size
        type
      }
    }
  }`;

  try {
    const response = await fetch("https://arweave.net/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ query })
    });
    const jsonResponse = await response.json();
    const tags = jsonResponse.data.transaction.tags;
    const contentType = tags.find(tag => tag.name === "Content-Type")?.value;

    // Check the content type and decide the action
    if (!contentType) {
      throw new Error("Content-Type tag not found.");
    }

    console.log(`Content-Type: ${contentType}`);

    if (contentType.startsWith("image/")) {
      // Handle image types
      const imageUrl = `https://arweave.net/${req.body.transactionId}`;
      res.send({
        message: "Image content detected.",
        content: imageUrl,
        contentType: contentType
      });
    } else if (contentType.startsWith("text/")) {
      // Handle text and markdown
      const dataResponse = await fetch(`https://arweave.net/${req.body.transactionId}`);
      const textData = await dataResponse.text();
      res.send({
        message: "Text or Markdown content detected.",
        content: textData,
        contentType: contentType
      });
    } else {
      res.send({
        message: "Unsupported content type.",
        contentType: contentType
      });
    }
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    res.send({ error: error.message });
  }
}

export default handler;
