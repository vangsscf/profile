export type SiteAsset = {
  type: string;
  body: string;
};

declare const assets: Record<string, SiteAsset | undefined> & { "/404.html": SiteAsset };

export default assets;
