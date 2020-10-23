wire:
	./wire.sh $(target)

build:
	./build_backend.sh
	./build_frontend.sh

clean:
	rm -rf dist

deploy: wire clean build
	./deploy $(target)

test-env:
	./set-up-test-env.sh