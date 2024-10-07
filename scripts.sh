npm run build
 aws s3 sync build/ s3://neptune-admin --acl public-read