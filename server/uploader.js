// Instantiate the minio client with the endpoint
// and access keys as shown below.
const { VITE_minio_BUCKET_NAME, VITE_minio_endPoint, VITE_minio_port, VITE_minio_accessKey, VITE_minio_secretKey } = import.meta.env

// var minioClient = new Minio.Client({
//   endPoint: VITE_minio_endPoint,
//   port: VITE_minio_port,
//   useSSL: false,
//   accessKey: VITE_minio_accessKey,
//   secretKey: VITE_minio_secretKey
// })
// // File that needs to be uploaded.
// var file = '/Users/huangjia285/temp/aaaa.jpg'
// // Make a bucket called europetrip.
// // minioClient.makeBucket('europetrip', 'us-east-1', function (err) {
// //   if (err) return console.log('aaaa', err)
// //   console.log('Bucket created successfully in "us-east-1".')

// //   // Using fPutObject API upload your file to the bucket europetrip.
// // })

// var metaData = {
//   'Content-Type': 'application/octet-stream',
//   'X-Amz-Meta-Testing': 1234,
//   example: 5678
// }
// minioClient.fPutObject(VITE_minio_BUCKET_NAME, 'aaa.jpg', file, metaData, function (err, etag) {
//   if (err) return console.log(err)
//   console.log('File uploaded successfully.', etag)
// })
