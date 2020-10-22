output "base_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}

output "names_table" {
  value = aws_dynamodb_table.names.name
}

output "rest_api_id" {
  value = aws_api_gateway_rest_api.gateway.id
}

output "source_code" {
  value = "s3://${aws_s3_bucket.lambdaholder.id}/${aws_s3_bucket_object.code.id}"
}
