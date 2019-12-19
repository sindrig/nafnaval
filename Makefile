
VER=$(shell git log -1 --pretty=format:"%H")
CODEBUCKET=$(shell terraform output codebucket)

deploy: clean build
	aws s3 cp dist/code.zip s3://$(CODEBUCKET)/$(VER)/code.zip
	terraform apply -var="app_version=$(VER)" -auto-approve

clean:
	rm -rf dist

build:
	./build_lambda