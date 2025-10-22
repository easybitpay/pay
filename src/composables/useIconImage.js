export default function useIconImage() {
  const { origin, href } = window.location
  const envStorageURL = import.meta.env.VITE_APP_STORAGE_URL

  const iconImage = (title, size = '32', type = 'color') => {
    const name = title.toLowerCase()

    return `${envStorageURL.includes('http') ? envStorageURL : `${origin}/${envStorageURL}`}/icons/${size}/${type}/${name}.png`
  }

  const storageImage = (url, size) => {
    if (url) {
      if (url.includes('http')) {
        return url
      } else {
        const URL = url.split('.')
        const newURL = `${URL[0]}_${size}x0.${URL[1]}`

        return `${envStorageURL.includes('http') ? envStorageURL : `${origin}/${envStorageURL}`}${
          size ? newURL : url
        }`
      }
    }
  }

  return { iconImage, storageImage }
}
