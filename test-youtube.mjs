import { fetchTranscript } from 'youtube-transcript-plus'

const url = process.argv[2]

if (!url) {
  console.log('Masukkan YouTube URL:')
  process.exit(1)
}

try {
  console.log('Testing YouTube transcript...')
  console.log('URL:', url)
  console.log('')

  const transcript = await fetchTranscript(url, {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    retries: 2,
    retryDelay: 1000,
  })

  console.log('✅ SUCCESS')
  console.log('Jumlah segments:', transcript.length)
  console.log('')
  console.log(transcript.slice(0, 3))
} catch (error) {
  console.log('❌ FAILED')
  console.log('Name:', error?.name)
  console.log('Message:', error?.message)
  console.log('')
  console.log(error)
}