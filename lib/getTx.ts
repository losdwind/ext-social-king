import Query, { type IrysTransactions } from "@irys/query"

async function getTx(tags: string[]): Promise<IrysTransactions | null> {
  try {
    const network = process.env.NEXT_PUBLIC_NETWORK || "devnet"

    const myQuery = new Query({ network })

    const queryResults = await myQuery
      .search("irys:transactions")
      .tags(tags)
      .sort("ASC")
      .limit(1)

    console.log("query results",queryResults)

    return queryResults
  } catch (e) {
    return null
  }
}

export default getTx