// 画像の静的 import（src/assets/works/*.webp）の型宣言。
// 本来は next-env.d.ts が読み込むが、あのファイルは next build / next dev が生成し
// .gitignore の対象なので、CI の typecheck（build より前に走る）の時点では存在しない。
// そのためここで常に読み込む（next-env.d.ts と重複しても問題はない）。
/// <reference types="next/image-types/global" />
