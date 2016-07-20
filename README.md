## Remove file or directory tool.

```
Usage: node fs_remove.js [directory] [options] [name...]

Options:
   -h, --help    help
   -f    remove file
   -d    remove directory

Example:
node fs_remove.js /Users/galois/projects/galois/fs_test -f *.iml *.class *.idea
node fs_remove.js /Users/galois/projects/galois/fs_test -d node_modules
```

TODO
1. 读取文件的详情,并记录下来