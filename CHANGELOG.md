## [1.3.3](https://github.com/theKashey/focus-lock/compare/v1.3.2...v1.3.3) (2024-02-20)

### Bug Fixes

- handle no activeElement case ([2895218](https://github.com/theKashey/focus-lock/commit/289521888013793e305146c9f68a54258ba55ae7))

## [1.3.2](https://github.com/theKashey/focus-lock/compare/v1.3.1...v1.3.2) (2024-02-19)

## [1.3.1](https://github.com/theKashey/focus-lock/compare/v1.3.0...v1.3.1) (2024-02-16)

### Bug Fixes

- support lock reactivation with no tabble nodes, fixes [#63](https://github.com/theKashey/focus-lock/issues/63) ([a8ef771](https://github.com/theKashey/focus-lock/commit/a8ef771bf83001d62402c17000ba0a12a18b67db))

# [1.3.0](https://github.com/theKashey/focus-lock/compare/v1.2.1...v1.3.0) (2024-02-16)

## [1.2.1](https://github.com/theKashey/focus-lock/compare/v1.2.0...v1.2.1) (2024-02-16)

### Bug Fixes

- add missing API to sibling/return-focus ([33cb860](https://github.com/theKashey/focus-lock/commit/33cb86087466570ec0a900c97b8f4c4c0b4dd6f4))

# [1.2.0](https://github.com/theKashey/focus-lock/compare/v1.1.0...v1.2.0) (2024-02-14)

### Bug Fixes

- remove visibility check from expandFocusableNodes ([543b9fe](https://github.com/theKashey/focus-lock/commit/543b9fe9f379e5744f2b51046422b51cf390370c))

### Features

- implement return focus ([f82447c](https://github.com/theKashey/focus-lock/commit/f82447cedec4d439601e07dc7ed879a5d90de01c))

# [1.1.0](https://github.com/theKashey/focus-lock/compare/v1.0.1...v1.1.0) (2024-02-11)

### Features

- extend sibling API for all focuble elements ([ecd666c](https://github.com/theKashey/focus-lock/commit/ecd666c5d92b95251f286b22d9429d816d70e669))

## [1.0.1](https://github.com/theKashey/focus-lock/compare/v1.0.0...v1.0.1) (2024-02-09)

### Bug Fixes

- correct abiity to restore focus on any focusable, fixes [#54](https://github.com/theKashey/focus-lock/issues/54) ([81ba288](https://github.com/theKashey/focus-lock/commit/81ba2883f6ecdb8f9ea367474d77306778e69185))
- correct tabIndex calculation for exotic components, fixes [#55](https://github.com/theKashey/focus-lock/issues/55) ([ef76a09](https://github.com/theKashey/focus-lock/commit/ef76a098639eeffb800e25680c17a277666d6cbf))
- support inert Attribute, fixes [#58](https://github.com/theKashey/focus-lock/issues/58) ([601f8d1](https://github.com/theKashey/focus-lock/commit/601f8d1af4a3161495174881f84dcedcdfa4c841))

# [1.0.0](https://github.com/theKashey/focus-lock/compare/v0.11.6...v1.0.0) (2023-10-12)

## [0.11.6](https://github.com/theKashey/focus-lock/compare/v0.11.5...v0.11.6) (2023-02-16)

### Bug Fixes

- secure access to cross-origin iframes, fixes [#45](https://github.com/theKashey/focus-lock/issues/45) ([860e283](https://github.com/theKashey/focus-lock/commit/860e2831a4b5c346c973b9d57f833e78a58fcc6f))

## [0.11.5](https://github.com/theKashey/focus-lock/compare/v0.11.4...v0.11.5) (2023-01-28)

## [0.11.4](https://github.com/theKashey/focus-lock/compare/v0.11.3...v0.11.4) (2022-11-24)

### Bug Fixes

- correct behavior for focusable-less targets. Implements [#41](https://github.com/theKashey/focus-lock/issues/41) ([9466d49](https://github.com/theKashey/focus-lock/commit/9466d49bc9ee72e53cc52821f5c67330aa284005))

## [0.11.3](https://github.com/theKashey/focus-lock/compare/v0.11.2...v0.11.3) (2022-09-19)

### Bug Fixes

- correct autofocus behavior; accept empty data-autofocus prop ([e144d52](https://github.com/theKashey/focus-lock/commit/e144d52eb5448badc4ab3a06b815a3924d1abdf8))
- Skip `.contains` if it is not available ([8d4c91c](https://github.com/theKashey/focus-lock/commit/8d4c91c457941a0ae668f477c3c5556e786ce929))

## [0.11.2](https://github.com/theKashey/focus-lock/compare/v0.11.1...v0.11.2) (2022-05-07)

### Bug Fixes

- use prototype-based node.contains, fixes [#36](https://github.com/theKashey/focus-lock/issues/36) ([c7eb950](https://github.com/theKashey/focus-lock/commit/c7eb9500adcb37ff2cac8a84b440fc59804d5874))

## [0.11.1](https://github.com/theKashey/focus-lock/compare/v0.11.0...v0.11.1) (2022-05-04)

# [0.11.0](https://github.com/theKashey/focus-lock/compare/v0.10.2...v0.11.0) (2022-05-01)

### Bug Fixes

- no longer block aria-disabled elements, fixes [#34](https://github.com/theKashey/focus-lock/issues/34) ([2bc8ee3](https://github.com/theKashey/focus-lock/commit/2bc8ee3a58f5c51b6a44df24b4bd443c01977737))
- restore built-in jsdoc ([edc8a82](https://github.com/theKashey/focus-lock/commit/edc8a82b1fe1e0a349ff60ebb599f63dbc2aa599))

### Features

- introduce FOCUS_NO_AUTOFOCUS ([5c2dc8f](https://github.com/theKashey/focus-lock/commit/5c2dc8fb371ee83400ae65c7f0923b19eaf99d05))

## [0.10.2](https://github.com/theKashey/focus-lock/compare/v0.10.1...v0.10.2) (2022-02-14)

### Bug Fixes

- correct button management for disabled state ([463682e](https://github.com/theKashey/focus-lock/commit/463682eb938928b3682ba91b1f1e4b2de4788cea))

## [0.10.1](https://github.com/theKashey/focus-lock/compare/v0.9.2...v0.10.1) (2021-12-12)

### Features

- suport focusOptions in setFocus ([69debee](https://github.com/theKashey/focus-lock/commit/69debee17264c44685c63e2d3366a524d1bcdb8b))

## [0.9.2](https://github.com/theKashey/focus-lock/compare/v0.9.1...v0.9.2) (2021-09-02)

## [0.9.1](https://github.com/theKashey/focus-lock/compare/v0.9.0...v0.9.1) (2021-05-13)

### Performance Improvements

- track operation complexity ([0d91516](https://github.com/theKashey/focus-lock/commit/0d91516d48a36572507861ca167d93ba16e41a1b))

# [0.9.0](https://github.com/theKashey/focus-lock/compare/v0.8.1...v0.9.0) (2021-03-28)

### Features

- allow setting focusOptions for prev/next focus actions ([d2e17d6](https://github.com/theKashey/focus-lock/commit/d2e17d66c59d9d04ac5f2196610a56e18cc1e1cf))

## [0.8.1](https://github.com/theKashey/focus-lock/compare/v0.8.0...v0.8.1) (2020-11-16)

### Bug Fixes

- contants endpoint not exposed ([ab51c37](https://github.com/theKashey/focus-lock/commit/ab51c37008c89348ab26f5efaa7ae159e239faa7))

# [0.8.0](https://github.com/theKashey/focus-lock/compare/v0.7.0...v0.8.0) (2020-09-30)

### Bug Fixes

- readonly control can be focused, fixes [#18](https://github.com/theKashey/focus-lock/issues/18) ([842d578](https://github.com/theKashey/focus-lock/commit/842d578cccbfed2b35b9c490229a40861e6c950a))
- speedup nested nodes resolution O(n^2) to O(nlogn) ([5bc1498](https://github.com/theKashey/focus-lock/commit/5bc1498b6a7885d9e6ce906777395c31eca2bdef))

### Features

- add relative focusing API ([3086116](https://github.com/theKashey/focus-lock/commit/308611642385f78a7a8b58848a0e1d540a83c9ba))
- switch to typescript ([fcd5892](https://github.com/theKashey/focus-lock/commit/fcd5892403e1b8de98957440669462e829f4d7c3))

# [0.7.0](https://github.com/theKashey/focus-lock/compare/v0.6.7...v0.7.0) (2020-06-18)

### Bug Fixes

- accept all focusable elements for autofocus, fixes [#16](https://github.com/theKashey/focus-lock/issues/16) ([88efbe8](https://github.com/theKashey/focus-lock/commit/88efbe81179e053a107ef20e37feddd1e826320f))
- dataset of null error ([7cb428b](https://github.com/theKashey/focus-lock/commit/7cb428be8cc61051ac31ef21b3d3b2463e187b9a))
- update logic for index diff calculations, fixes [#14](https://github.com/theKashey/focus-lock/issues/14) ([4c7e637](https://github.com/theKashey/focus-lock/commit/4c7e63721394716370bdfb9e755af7cd965708cc))

## [0.6.7](https://github.com/theKashey/focus-lock/compare/v0.6.6...v0.6.7) (2020-04-17)

### Bug Fixes

- better handle jump out conditions. Focus on the active radio and look for tailing guards as well ([421e869](https://github.com/theKashey/focus-lock/commit/421e8690d81dbeaaa43231a1be46bd4b235a84bf))

## [0.6.6](https://github.com/theKashey/focus-lock/compare/v0.6.5...v0.6.6) (2019-10-17)

### Bug Fixes

- detect document using nodeType, fixes [#11](https://github.com/theKashey/focus-lock/issues/11) ([c03e6bc](https://github.com/theKashey/focus-lock/commit/c03e6bc99a467dace0c346397480b95dcff7f74d))

## [0.6.5](https://github.com/theKashey/focus-lock/compare/v0.6.4...v0.6.5) (2019-06-10)

### Bug Fixes

- dont use array.find, fixes [#9](https://github.com/theKashey/focus-lock/issues/9) ([cbeec63](https://github.com/theKashey/focus-lock/commit/cbeec6319bb9716c3cf729e2134d4eb7f5702358))

## [0.6.4](https://github.com/theKashey/focus-lock/compare/v0.6.3...v0.6.4) (2019-05-28)

### Features

- sidecar for constants ([8a42017](https://github.com/theKashey/focus-lock/commit/8a4201775b3689bdbda389a0eb15e2afde5d1d2a))

## [0.6.3](https://github.com/theKashey/focus-lock/compare/v0.6.2...v0.6.3) (2019-04-22)

### Bug Fixes

- allow top guard jump ([58237a3](https://github.com/theKashey/focus-lock/commit/58237a358bdab02cf75c0e41d67ef209f833dec5))

## [0.6.2](https://github.com/theKashey/focus-lock/compare/v0.6.1...v0.6.2) (2019-03-11)

### Bug Fixes

- fix guard order ([c390b1a](https://github.com/theKashey/focus-lock/commit/c390b1aa94c42c74015f87a35443444f96a43a6c))

## [0.6.1](https://github.com/theKashey/focus-lock/compare/v0.6.0...v0.6.1) (2019-03-10)

# [0.6.0](https://github.com/theKashey/focus-lock/compare/v0.5.4...v0.6.0) (2019-03-09)

### Features

- multi target lock ([79bce83](https://github.com/theKashey/focus-lock/commit/79bce837afed02ca9b1e71ee0dcf4f1b74367133))

## [0.5.4](https://github.com/theKashey/focus-lock/compare/v0.5.3...v0.5.4) (2019-01-22)

### Bug Fixes

- failback to focusable node if tabble not exists ([8b9d018](https://github.com/theKashey/focus-lock/commit/8b9d01882d4191cf436606515043d7dfe9bc52a5))

## [0.5.3](https://github.com/theKashey/focus-lock/compare/v0.5.2...v0.5.3) (2018-11-11)

### Bug Fixes

- disabled buttons with tab indexes ([632e08e](https://github.com/theKashey/focus-lock/commit/632e08ec58c1a1d49b6b148edd2f3602298ff1d9))

## [0.5.2](https://github.com/theKashey/focus-lock/compare/v0.5.1...v0.5.2) (2018-11-01)

## [0.5.1](https://github.com/theKashey/focus-lock/compare/v0.5.0...v0.5.1) (2018-10-24)

# [0.5.0](https://github.com/theKashey/focus-lock/compare/v0.4.2...v0.5.0) (2018-10-18)

## [0.4.2](https://github.com/theKashey/focus-lock/compare/v0.4.1...v0.4.2) (2018-09-06)

## [0.4.1](https://github.com/theKashey/focus-lock/compare/v0.4.0...v0.4.1) (2018-08-28)

# [0.4.0](https://github.com/theKashey/focus-lock/compare/v0.3.0...v0.4.0) (2018-08-28)

# [0.3.0](https://github.com/theKashey/focus-lock/compare/v0.2.4...v0.3.0) (2018-05-08)

## [0.2.4](https://github.com/theKashey/focus-lock/compare/v0.2.3...v0.2.4) (2018-04-18)

## [0.2.3](https://github.com/theKashey/focus-lock/compare/v0.2.2...v0.2.3) (2018-04-18)

## [0.2.2](https://github.com/theKashey/focus-lock/compare/v0.2.1...v0.2.2) (2018-04-11)

## [0.2.1](https://github.com/theKashey/focus-lock/compare/v0.2.0...v0.2.1) (2018-03-31)

# 0.2.0 (2018-03-15)
