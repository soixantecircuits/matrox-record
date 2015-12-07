# Matrox Monarch record

Interactive command-line based on the following documentation:
ftp://ftp.matrox.com/pub/video/doc/Matrox%20Monarch%20HDX%20Dev%20Tools%20Reference%20Guide_1.1.1.pdf

Previous version was based on:
http://www.matrox.com/video/media/pdf/support/monarch_hd/doc/en_Matrox_Monarch_HD_Control_API_Guide_1_1_3.pdf

## Installation

0. Clone :
`git clone git@github.com:soixantecircuits/matrox-record.git`

1. Install
`npm install`

2. configure by modifying `config.json` file.

3. configure your option there :

```
options = {
    timeout: 3000,
    permanentTestInterval: 60000,
    recordDuration: 15000,
    hdx: true
  },
```

4. And start with: `npm start`

Make sure you are pointing to the right IP of you Matrox Monarch HD or HDX

You can select, the `hdx` option with `true` or `false`

# TODO

[ ] Implement full API support for HDX model
[ ] Make it a npm module
[ ] Make it a global command-line controller
