# Eslint-th

## Necessary

1. 7.+ more eslint library
2. Environment variable: NODE_PATH

## Usage

``` bash
eslint-th [options] file.js [file.js...]
```

Compare to eslint-cli, command has been extended as follow:

| command | description |
---|:--|
| --all | Show warning level, supersede quite (default false) |
| --root | Set up a working directory after which all paths follow |
| --auto | Automatic check file ".eslintrc, .eslintignore" (default true) |

Remove command

- --printConfig
- --useStdin
- --quite
- --fix
- --fix-dry-run
- --fix-type

## Plan

- Increase inspection speed (very slow, too many to scan)
- Remove the burden caused by fix function (bad function)
- Achieve true "-quite" (take up extra time)
- Complete statistics (e.g. number of scanned files and time consuming)
