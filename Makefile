wire:
	./wire.sh $(target)

build:
	./build_backend.sh
	./build_frontend.sh

tfinit:
	if [ ! -d infra/$(target)/.terraform ]; then cd infra/$(target) && terraform init; fi

clean:
	rm -rf dist

deploy: tfinit wire clean build
	./deploy $(target)

test-env:
	./set-up-test-env.sh