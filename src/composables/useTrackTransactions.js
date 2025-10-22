export default function useTrackTransactions() {
  const trackTransaction = (hash, explorer, key) => {
    const explorer_address = typeof explorer === 'string' ? JSON.parse(explorer) : explorer

    return explorer_address[key] + hash
  }

  return {
    trackTransaction
  }
}
