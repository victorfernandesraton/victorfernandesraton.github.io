{
  description = "vraton blog flake";
  inputs = {

    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";



  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        blog = pkgs.stdenv.mkDerivation {
          name = "blog";
          # Exclude themes and public folder from build sources
          src = builtins.filterSource
            (path: type: !(type == "directory" &&
              (baseNameOf path == "themes" ||
                baseNameOf path == "public")))
            ./.;
          # Link theme to themes folder and build
          buildPhase = ''
            mkdir -p themes
            ${pkgs.hugo}/bin/hugo --minify
          '';
          installPhase = ''
            cp -r public $out
          '';
          meta = with pkgs.lib; {
            description = "Victor Raton's personal tech blog";
            platforms = platforms.all;
          };
        };
      in
      {
        packages = {
          blog = blog;
          default = blog;
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ hugo ];
        };
      });

}
