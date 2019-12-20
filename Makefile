build:
	./build_backend
	./build_frontend

clean:
	rm -rf dist

deploy: clean build
	./deploy