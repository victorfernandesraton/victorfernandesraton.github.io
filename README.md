# Victor Raton's Blog
This project is a statuic site generated by [Hugo](https://gohugo.io/) and build as is a standalone Hugo application without external sources or plugins

## Install locally
Using these [guidelines](https://gohugo.io/installation/linux/) to install hugo in your sistem, but do catful, i test this project using Debian 12 (bookworm) and Go 1.22, also i left a `flake.nix` as a reference too

## Build from sourc
If you knoiw what you doing, using this steps
### Requirements

- Git
- Go version 1.20 or later
- C compiler, either GCC or Clang

```bash
CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@0.123.8
```

## Run
Just using `hugo serve` or `hugo serve -D` to see all these stuff work
