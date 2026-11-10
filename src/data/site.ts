import type { StaticImageData } from "next/image";
import karioDesktop from "../assets/works/kario-tsukishiro-desktop.webp";
import karioMobile from "../assets/works/kario-tsukishiro-mobile.webp";
import karioDetail from "../assets/works/kario-tsukishiro-detail.webp";
import tokiwaDesktop from "../assets/works/tokiwa-seiko-desktop.webp";
import tokiwaMobile from "../assets/works/tokiwa-seiko-mobile.webp";
import tokiwaDetail from "../assets/works/tokiwa-seiko-detail.webp";
import yuyadoDesktop from "../assets/works/yuyado-yamagasumi-photo-desktop.webp";
import yuyadoMobile from "../assets/works/yuyado-yamagasumi-photo-mobile.webp";
import yuyadoDetail from "../assets/works/yuyado-yamagasumi-photo-detail.webp";
import naginoDesktop from "../assets/works/nagino-desktop.webp";
import naginoMobile from "../assets/works/nagino-mobile.webp";
import naginoDetail from "../assets/works/nagino-detail.webp";

/*
 * All visible copy lives here so identity, works, services and the process
 * can be updated without touching components.
 */

export const site = {
  name: "niwatory",
  /* One entry per display line; the hero renders each line letter-by-letter
     (kinetic reveal), so any number of lines works. */
  nameLines: ["niwatory"],
  /* Mono micro label above the wordmark (Latin only: the mono face has no kana). */
  role: "Web Design / Frontend / WebGL",
  /* Instrument-style call sign shown as a micro label under the hero wordmark. */
  callSign: "N-01 / KINETIC INSTRUMENT",
  heroLead:
    "デザインから実装・公開まで、通して担当します。表示が速く、動きにも意味のあるWebサイトをつくります。",
  heroCta: "制作実績を見る",
  heroSubCta: "相談する",
  /* Accessible name of the works index at the foot of the hero. */
  heroIndexLabel: "制作実績の目次",
  works: {
    label: "Selected Works",
    heading: "制作実績",
    note: "いずれも架空のブランドを題材にした自主制作です。企画・デザイン・実装まで一人で担当しました。",
    /* Label of the close-up under each screenshot. */
    detailLabel: "見どころ",
  },
  services: {
    label: "Services",
    heading: "できること",
    lead: "ページを1枚つくるところから、今あるサイトの手直しまで。目的に合わせて、必要なところだけお手伝いします。",
  },
  process: {
    label: "Process",
    heading: "ご依頼の流れ",
    lead: "途中の段階でも見ていただけるように、公開前の確認用URLを早めにお渡しします。",
  },
  about: {
    label: "About",
    heading: "niwatory について",
    body: [
      "Webサイトの制作と、業務を自動化するツールの開発をしています。Claude Code を中心にした AI 駆動開発で実装を速く進め、設計の判断と仕上がりの確認は自分で行います。",
      "動きは飾りではなく、内容を伝えるために使います。スマホでの読みやすさ、表示の速さ、キーボードや読み上げでの使いやすさも、最初から確かめながらつくります。",
      "稼働は週末が中心ですが、メッセージにはできるだけ早くお返事します。",
    ],
    tags: [
      "HTML / CSS",
      "React / Next.js",
      "TypeScript",
      "Three.js / WebGL / GLSL",
      "GSAP",
      "Vite / Vitest",
      "Accessibility (axe)",
      "GitHub Actions",
    ],
  },
  contact: {
    label: "Contact",
    heading: "まだ形になっていない段階でも、ご相談ください。",
    body: "このページをご覧になったサービスのメッセージから、お気軽にご連絡ください。作品のソースコードは GitHub で公開しています。",
    cta: "GitHub を見る",
    /* Public profile instead of a mailbox: nothing personal to expose,
       and the link can never go stale the way an unowned domain could. */
    ctaHref: "https://github.com/niwatory11",
  },
  footer: {
    note: "掲載している制作実績は、いずれも架空のブランドを題材にした自主制作です。実在の企業・店舗とは関係ありません。一部の写真は画像生成AIで作成しています。",
    credit: "このサイトは Next.js、React Three Fiber、GSAP、Lenis で制作しています。",
  },
} as const;

export type WorkLink = { label: string; href: string };

/* A close-up of one part of the site, shown under the main screenshot. */
export type WorkDetail = {
  title: string;
  body: string;
  image: StaticImageData;
  alt: string;
};

export type Work = {
  slug: string;
  title: string;
  kind: string;
  /* Short trade label for the works index in the hero. */
  field: string;
  /* Shorter name for the works index, when the full title would wrap on
     a 360px phone (two index columns of about 120px each). */
  indexTitle?: string;
  year: string;
  summary: string;
  points: string[];
  tech: string[];
  /* Shown in the browser-frame bar above the screenshot. */
  url: string;
  links: WorkLink[];
  /* Set when the site is not public yet; the card shows it instead of links. */
  status?: string;
  desktop: StaticImageData;
  mobile: StaticImageData;
  detail: WorkDetail;
};

export const works: Work[] = [
  {
    slug: "kario-tsukishiro",
    title: "菓寮 月白",
    kind: "和菓子店のブランドサイト",
    field: "和菓子店",
    year: "2026",
    summary: "二十四節気にあわせて菓子が替わる小さな店。縦書きの見出しと夜の月で、店の静かな空気を伝えます。",
    points: [
      "来店予約フォーム（入力チェックとエラー表示つき）",
      "アクセシビリティ検査（axe）を GitHub Actions で毎回自動実行",
      "青海波の文様は SVG で描画し、画像を増やさず軽量に",
    ],
    tech: ["React 19", "Vite", "CSS Modules", "Vitest", "Playwright"],
    url: "niwatory11.github.io/kario-tsukishiro",
    links: [
      { label: "サイトを見る", href: "https://niwatory11.github.io/kario-tsukishiro/" },
      { label: "GitHub", href: "https://github.com/niwatory11/kario-tsukishiro" },
    ],
    desktop: karioDesktop,
    mobile: karioMobile,
    detail: {
      title: "今日の暦",
      body: "開いた日の日付から、二十四節気と今宵の月を計算して表示します。主役の菓子も、この暦の季節に合わせて入れ替わります。",
      image: karioDetail,
      alt: "菓寮 月白の「今日の暦」。節気の名前と月のかたち、一年の目盛りが並んでいる",
    },
  },
  {
    slug: "tokiwa-seiko",
    title: "常盤精工",
    kind: "精密部品加工会社のコーポレートサイト",
    field: "精密部品加工",
    year: "2026",
    summary: "町工場の「図面どおりにつくる力」を、製図の線と表題欄をモチーフにした画面で見せます。",
    points: [
      "部品の図面を SVG で描き、画面に入ると線が引かれていくアニメーション",
      "材質・納期・依頼内容を送れる見積もりフォーム（入力しながらチェック）",
      "設備・品質保証・会社案内まで1ページで完結",
    ],
    tech: ["React 19", "Vite", "CSS Modules", "SVG", "Vitest"],
    url: "niwatory11.github.io/tokiwa-seiko",
    links: [
      { label: "サイトを見る", href: "https://niwatory11.github.io/tokiwa-seiko/" },
      { label: "GitHub", href: "https://github.com/niwatory11/tokiwa-seiko" },
    ],
    desktop: tokiwaDesktop,
    mobile: tokiwaMobile,
    detail: {
      title: "加工範囲の比較図",
      body: "4台の加工機に載る大きさを、同じ縮尺の SVG で並べました。A4用紙を物差しにして、手元の部品が載るかどうかを見比べられます。",
      image: tokiwaDetail,
      alt: "常盤精工の加工範囲の比較図。加工機に載る大きさが、A4用紙と同じ縮尺で描かれている",
    },
  },
  {
    slug: "yuyado-yamagasumi",
    title: "湯宿 山霞",
    kind: "温泉旅館のサイト",
    field: "温泉旅館",
    year: "2026",
    summary: "霞のかかる谷の宿。流れる霞と湯面の揺らぎを、ブラウザの中でリアルタイムに描いています。",
    points: [
      "Three.js を使わず、WebGL2 と GLSL のシェーダーで霞と湯面を描画",
      "到着から出発までの滞在の流れを、夕暮れから夜明けへ移る空の色で案内",
      "動きを減らす設定の人には、静止した画面で表示",
    ],
    tech: ["React 19", "Vite", "WebGL2", "GLSL", "Vitest"],
    url: "niwatory11.github.io/yuyado-yamagasumi-photo",
    links: [
      { label: "サイトを見る", href: "https://niwatory11.github.io/yuyado-yamagasumi-photo/" },
      { label: "描画だけの版", href: "https://niwatory11.github.io/yuyado-yamagasumi/" },
      { label: "GitHub", href: "https://github.com/niwatory11/yuyado-yamagasumi-photo" },
    ],
    desktop: yuyadoDesktop,
    mobile: yuyadoMobile,
    detail: {
      title: "月見の湯",
      body: "湯面に映る月と灯りを、GLSL のシェーダーで描いています。カーソルや指でなぞると波が立ち、映った月が揺れて崩れます。",
      image: yuyadoDetail,
      alt: "湯宿 山霞の月見の湯。暗い湯面に、月と灯りが揺れながら映っている",
    },
  },
  {
    slug: "nagino",
    title: "NAGINO都市環境技研",
    kind: "都市環境エンジニアリング企業のLP",
    field: "環境エンジニアリング",
    indexTitle: "NAGINO",
    year: "2026",
    summary: "建物の排熱を街のエネルギーに変える会社。取引先と採用候補者の両方に向けた1ページです。",
    points: [
      "フレームワークを使わない、素の HTML・CSS・JavaScript",
      "熱の流れを3つの段階に切り替えて見られる循環図（SVG）",
      "OS の設定に合わせて切り替わるダークモード",
    ],
    tech: ["HTML", "CSS", "JavaScript", "SVG"],
    url: "niwatory11.github.io/nagino-urban-climate",
    links: [
      { label: "サイトを見る", href: "https://niwatory11.github.io/nagino-urban-climate/" },
      { label: "GitHub", href: "https://github.com/niwatory11/nagino-urban-climate" },
    ],
    desktop: naginoDesktop,
    mobile: naginoMobile,
    detail: {
      title: "ある街区の一日",
      body: "昼に余る熱と、夜に足りない熱。事業の内容を1枚のグラフで説明しています。線と面は SVG、文字は HTML で重ねているので、スマホの幅でも文字が小さくなりません。",
      image: naginoDetail,
      alt: "NAGINOのグラフ「ある街区の一日」。昼に余る排熱と、夜に足りない熱需要の2本の曲線が描かれている",
    },
  },
];

export type Service = {
  title: string;
  body: string;
  items: string[];
};

export const services: Service[] = [
  {
    title: "ランディングページ制作",
    body: "商品やサービスを1ページで伝え、問い合わせや購入につなげます。スマホでの読みやすさと表示の速さを優先します。",
    items: ["構成・文章の整理", "デザイン", "実装", "フォーム"],
  },
  {
    title: "コーポレート・ブランドサイト",
    body: "会社やお店の空気を、写真・文字組み・動きで伝えます。文言は1か所にまとめて、あとから直しやすくします。",
    items: ["複数セクション構成", "お知らせ・採用", "ダークモード"],
  },
  {
    title: "今あるサイトの改善",
    body: "表示が遅い、スマホで崩れる、古く見える。今のサイトの弱いところを洗い出し、優先順位をつけて直します。",
    items: ["表示速度", "スマホ対応", "アクセシビリティ", "デザインの手直し"],
  },
  {
    title: "3D・WebGL の演出",
    body: "Three.js やシェーダーで、印象に残る動きをつくります。重くならないように調整し、動きを減らす設定にも対応します。",
    items: ["React Three Fiber", "GLSL", "GSAP", "スクロール演出"],
  },
];

export type Step = {
  title: string;
  body: string;
};

export const steps: Step[] = [
  {
    title: "ご相談・ヒアリング",
    body: "目的、見てほしい相手、参考にしたいサイト、公開したい時期を伺います。",
  },
  {
    title: "構成とデザインの方向",
    body: "ページの構成と、色・文字・写真の方向を、つくり込む前にすり合わせます。",
  },
  {
    title: "実装",
    body: "スマホからPCまでの表示、表示の速さ、読み上げへの対応を確かめながら組みます。",
  },
  {
    title: "確認と修正",
    body: "公開前の確認用URLで実際に触っていただき、気になるところを直します。",
  },
  {
    title: "公開・納品",
    body: "サーバーへの公開、またはファイル一式でお渡しします。",
  },
];
