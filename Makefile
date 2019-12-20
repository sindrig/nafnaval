
VER=$(shell git log -1 --pretty=format:"%H")
CODEBUCKET=$(shell terraform output codebucket)


build:
	./build_lambda

clean:
	rm -rf dist

deploy: clean build
	aws s3 cp dist/code.zip s3://$(CODEBUCKET)/$(VER)/code.zip
	terraform apply -var="app_version=$(VER)" -auto-approve