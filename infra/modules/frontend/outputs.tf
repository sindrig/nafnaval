output "frontendbucket" {
  value = aws_s3_bucket.www.bucket
}

output "rootbucket" {
  value = aws_s3_bucket.root.bucket
}

output "website_endpoint" {
  value = aws_s3_bucket.www.website_endpoint
}

output "root_website_endpoint" {
  value = aws_s3_bucket.root.website_endpoint
}
