build:
	./build_backend.sh
	./build_frontend.sh

tfinit:
	if [ ! -d infra/$(target)/.terraform ]; then cd infra/$(target) && terraform init; fi

clean:
	rm -rf dist

deploy: tfinit clean build
	./deploy $(target)

local-env:
	make target=dev tfinit
	./set-up-local-env.sh