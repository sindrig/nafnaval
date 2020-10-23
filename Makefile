wire:
	./wire.sh $(target)

build:
	./build_backend
	./build_frontend

clean:
	rm -rf dist

deploy: wire clean build
	./deploy $(target)

test-env:
	./set-up-test-env.sh