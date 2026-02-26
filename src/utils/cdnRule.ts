import { parseJwt } from './util';

export const cdnRule = {
  version: 20221117,
  rules: [
    {
      // site: "reddit",
      urlPattern: /(.*)\/\/preview\.redd\.it\/(.*)\.(.*)/,
      replace(e) {
        return e.replace(/preview/, 'i').replace(/\?(.*)/, '');
      },
    },
    {
      // site: "deviantart",
      urlPattern: /https:\/\/images\S+\.wixmp\.com\/f\/\S+\/v1\/fill\/\S+\?token\S+/,
      replace(e) {
        const t = new URL(e).searchParams.get('token');
        if (!t) return e;
        const r = parseJwt(t);
        if (r.obj && r.obj[0] && r.obj[0][0] && r.obj[0][0].height) {
          const t = r.obj[0][0].height.replace('<=', ''),
            c = r.obj[0][0].width.replace('<=', '');
          return e.replace(/\/w_\d+,h_\d+,q_\d+/, `/w_${c},h_${t},q_100`);
        }
        return e;
      },
    },
    {
      // site: "behance",
      urlPattern: /(.*)behance.net\/project_modules\/(.*)/,
      replace(e) {
        const t = '/source/';
        return e.replace('/max_1200/', t).replace('/2800_opt_1/', t).replace('/disp/', t).replace('/1400_opt_1/', t);
      },
    },
    {
      // site: "imgur",
      urlPattern: /(.*)i\.imgur\.com\/(.*)/,
      replace(e) {
        return e.replace(/\?(.*)/, '?maxwidth=99999');
      },
    },
    {
      // site: "twitter",
      urlPattern: /(.*)twimg.com(.*)name=(.*)/,
      replace(e) {
        return e.replace(/name=(.*)/, 'name=orig');
      },
    },
    {
      // site: "meiye",
      urlPattern: '(.*)image.meiye.art/(.*)',
      replace(e) {
        return e.split('?imageMogr2')[0].split('?vframe')[0];
      },
    },
    {
      // site: "大作",
      urlPattern: '(.*)bigurl(.*)',
      replace(e) {
        return e.replace('pc_236_webp_2x', 'pc_680_webp').replace('pc_236_webp', 'pc_680_webp');
      },
    },
    {
      // site: "Lapa.ninja",
      urlPattern: '(.*)cdn.lapaninja.com(.*)',
      replace(e) {
        return e.replace('-thumb.jpg', '.jpg');
      },
    },
    {
      // site: "Dribbble",
      urlPattern: 'https?://cdn.dribbble.com/*',
      replace(e) {
        if (e.includes('userupload')) {
          return e.split('?')[0];
        }
        if (e.includes('screenshots') && e.includes('media')) {
          return e.split('?')[0];
        }
        return e.includes('screenshots') && e.includes('.gif')
          ? e.split('?')[0].replace('_4x', '')
          : e.includes('/videos/')
            ? e.replace('_large_preview', '')
            : -1 === e.indexOf('/attachments/')
              ? e.replace(/_1x/g, '').replace(/_teaser/g, '')
              : e;
      },
    },
    {
      // site: "Pexels",
      urlPattern: 'https?://images.pexels.com/*',
      replace(e) {
        return `${e.split('?')[0]}?auto=compress`;
      },
    },
    {
      // site: "新浪微博",
      // FIX， n.sinaimg 的图片规则不适配
      urlPattern: /(.*)\/\/[^n]*[.]sinaimg[.]cn\/([a-z]*)(\d+)\//,
      // urlPattern: /(.*)\/\/.*[.]sinaimg[.]cn\/([a-z]*)(\d+)\//,
      replace(e) {
        return e.includes('.mp4') ? e : e.replace(/(cn)\/([a-z]*)(\d+)\//, 'cn/large/');
      },
    },
    {
      // site: "QQ相册/空间",
      urlPattern: 'https?://.*[.]photo[.]store[.]qq[.]com/.*',
      replace(e) {
        return e.replace(/[/]m[/]/, '/o/').replace(/&w=[\d]+&h=[\d]+/, '');
      },
    },
    {
      // site: "QQ相册2",
      urlPattern: 'https?://group[.]store[.]qq[.]com/.*',
      replace(e) {
        return e
          .replace(/[/]400$/, '/800')
          .replace(/[/]200$/, '/800')
          .replace(/[/]100$/, '/800');
      },
    },
    {
      // site: "百度贴吧",
      urlPattern: 'https?://tiebapic[.]baidu[.]com/forum.*',
      replace(e) {
        const t = e.match(/^(http:\/\/tiebapic\.baidu\.com\/forum\/)ab(pic\/item\/[\w.]+)/i);
        if (/\/sys\/portrait/.test(e)) return e.replace(/\/sys\/portrait/, '/sys/portraitl');
        if (t) return t[1] + t[2];
        const r = e.match(/\/sign=\w+\/([\w.]+)$/);
        return r ? `http://tiebapic.baidu.com/forum/pic/item/${r[1]}` : e;
      },
    },
    {
      // site: "百度图趣",
      urlPattern: 'https?://hiphotos[.]baidu[.]com/.*',
      replace(e) {
        return e.replace(/[/]abpic[/]/, '/pic/').replace(/[/]pin[/]w=[\d]+[/].+[/]/, '/pin/pic/item/');
      },
    },
    {
      // site: "豆瓣相册",
      urlPattern: /https?:\/\/img[\d]*\.doubanio\.com\/.*/,
      replace(e) {
        return e
          .replace(/[/]s[/]/, '/orginal/')
          .replace(/[/]m[/]/, '/orginal/')
          .replace(/[/]l[/]/, '/orginal/')
          .replace(/[/]sqs[/]/, '/orginal/');
      },
    },
    {
      // site: "Flickr",
      urlPattern: '.*[.]staticflickr[.]com.*',
      replace(e) {
        return e.replace(/_[nms]\.jpg$/, '_b.jpg');
      },
    },
    {
      // site: "poco.cn",
      urlPattern: 'http?://img[d].*pocoimg*',
      replace(e) {
        return e.replace(/_\d{3}.jpg$/, '.jpg');
      },
    },
    {
      // site: "蘑菇街",
      urlPattern: 'https?://.*[.]mogucdn[.]com/.*.jpg',
      replace(e) {
        return `${e.replace(/_[\d]{3}x[\d]+.jpg$/, '_468x468.jpg').split('.jpg')[0]}.jpg`;
      },
    },
    {
      // site: "pinterest",
      urlPattern: 'https?://.*[.]pinimg[.]com/.*.jpg',
      // replace: function (e) {
      //   if (e.includes("75x75_RS")) return e;
      //   if (e.includes("140x140_RS")) return e;
      //   let r = e.replace(/[0-9]+x/g, "originals");
      //   if (!r.includes(".jpg") && !r.includes(".png")) return r;
      //   return r;
      // }
      async replaceAsync(e: string) {
        return new Promise((resolve) => {
          if (e.includes('75x75_RS')) return resolve(e);
          if (e.includes('140x140_RS')) return resolve(e);
          const r = e.replace(/[0-9]+x/g, 'originals');
          if (!r.includes('.jpg') && !r.includes('.png')) return resolve(r);
          {
            const s = new AbortController();
            setTimeout(() => s.abort(), 1e3);
            const c = fetch(r.replace('.jpg', '.png'), { method: 'HEAD', signal: s.signal }),
              a = fetch(r.replace('.png', '.jpg'), { method: 'HEAD', signal: s.signal });
            Promise.all([c, a]).then((r) =>
              200 === r[0].status ? resolve(r[0].url) : 200 === r[1].status ? resolve(r[1].url) : resolve(e),
            );
          }
        });
      },
    },
    {
      // site: "pixiv",
      urlPattern: /(.*)\/\/i\.pximg\.net\/(.*)/,
      async replaceAsync(e) {
        return new Promise((t) => {
          let r = e;
          if (
            !(r = (r = (r = (r = r.replace(/c\/\d+x\d+_\d+(\_[A-z0-9]{2}){0,1}\//, '')).replace(
              /img-master/,
              'img-original',
            )).replace(/custom-thumb/, 'img-original')).replace(/_(?<=_p\d_)(.*)1200/, '')).includes('.jpg')
            && !r.includes('.png')
          )
            return t(r);
          {
            const s = new AbortController();
            setTimeout(() => s.abort(), 1e3);
            const c = fetch(r.replace('.jpg', '.png'), { method: 'HEAD', signal: s.signal, mode: 'no-cors' }),
              a = fetch(r.replace('.png', '.jpg'), { method: 'HEAD', signal: s.signal, mode: 'no-cors' });
            Promise.all([c, a]).then((r) =>
              200 === r[0].status ? t(r[0].url) : 200 === r[1].status ? t(r[1].url) : t(e),
            );
          }
        });
      },
    },
    {
      // site: "1688",
      urlPattern: 'https?://cbu01.alicdn.com/img/ibank/.*..*x.*.jpg',
      replace(e) {
        return e.replace(/\.\d+x.*\./, '.');
      },
    },
    {
      // site: "淘宝",
      urlPattern: /.(?:taobao|tb|ali)cdn(.+)_\d+x\d+.jpg(.*)/,
      replace(e) {
        return e.replace(/_\d+x\d+.jpg(_.webp)?/, '');
      },
    },
    {
      // site: "天猫",
      urlPattern: /.(?:taobao|tb|ali)cdn(.+)_\d+x\d+\S\d+.jpg(.*)/,
      replace(e) {
        return e.replace(/_\d+x\d+\S\d+.jpg(_.webp)?/, '');
      },
    },
    {
      // site: "Amazon",
      urlPattern: 'https://(images-na.ssl-images|m.media)-amazon.com/images/(.*)',
      replace(e) {
        return e.replace(/\.\_\S+\./, '.');
      },
    },
    {
      // site: "京东",
      urlPattern: 'https://.*.360buyimg.com.*',
      replace(e) {
        return e
          .replace(/\/n\d+\//, '/n0/')
          .replace(/s\d+x\d+_?/, '')
          .split('!cc')[0]
          .split('!q')[0]
          .replace(/.jpg.avif/, '.jpg');
      },
    },
    {
      // site: "officesnapshots wordpress",
      urlPattern: 'https://officesnapshots.com/wp-content/uploads/(.*)',
      replace(e) {
        return e.replace(/-\d+x\d+-(.*)\./, '.').split('?w=')[0];
      },
    },
    {
      // site: "Houzz",
      urlPattern: 'https://st[.]hzcdn[.]com/.*',
      replace(e) {
        return e.replace(/fimgs/, 'simgs').replace(/_/, '_14-');
      },
    },
    {
      // site: "HouseBeautiful",
      urlPattern: 'https://hips[.]hearstapps[.]com/.*',
      replace(e) {
        return e.replace(/[.]jpg{1,}/, '.jpg').split('&resize=')[0];
      },
    },
    {
      // site: "Officesnapshots",
      urlPattern: 'https://officesnapshots[.]com/.*',
      replace(e) {
        return e.replace(/-\d{3,4}x\d{3,4}/, '');
      },
    },
    {
      // site: "Archilovers",
      urlPattern: 'https?://img[.]archilovers[.]com/.*',
      replace(e) {
        return e.replace(/[a-z]_[0-9][0-9][0-9]_/, '').split('?w=')[0];
      },
    },
    {
      // site: "AD",
      urlPattern: 'https://media[.]architecturaldigest[.]com/.*',
      replace(e) {
        return e.replace(/w_\d+/, 'w_5000').replace(/,h_\d+/, '');
      },
    },
    {
      // site: "Archdaily 中文版",
      urlPattern: 'https?://images[.]adsttc[.]com[.]qtlcn[.]com/.*',
      replace(e) {
        return e
          .replace(/thumb_jpg/, 'large_jpg')
          .replace('/medium_jpg/', '/large_jpg/')
          .replace('/newsletter/', '/large_jpg/');
      },
    },
    {
      // site: "ArchDaily 国际版",
      urlPattern: 'https?://images[.]adsttc[.]com/.*',
      replace(e) {
        return e
          .replace(/slideshow/, 'large_jpg')
          .replace(/thumb_jpg/, 'large_jpg')
          .replace('/medium_jpg/', '/large_jpg/')
          .replace('/newsletter/', '/large_jpg/');
      },
    },
    {
      // site: "Dezeen",
      urlPattern: 'https://static[.]dezeen[.]com/.*',
      replace(e) {
        return e
          .replace(/slideshow/, 'large_jpg')
          .replace(/thumb_jpg/, 'large_jpg')
          .replace(/-\d+x\d+.jpg/, '.jpg');
      },
    },
    {
      // site: "Archiproducts",
      urlPattern: 'https://img[.]edilportale[.]com/.*',
      replace(e) {
        return e.replace(/-thumbs.*.[a-z]_/, 's/').replace(/news.*.[a-z]_/, 'news/');
      },
    },
    {
      // site: "Wordpress 通用",
      urlPattern: '/wp-content/uploads/.*',
      replace(e) {
        return e.replace(/-\d+x\d+/, '').split('?w=')[0];
      },
    },
    {
      // site: "Squarespace 通用",
      urlPattern: 'https://static[0-9][.]squarespace[.]com/.*',
      replace(e) {
        return e.replace(/format=[0-9]{3,4}w/, 'format=3000w');
      },
    },
    {
      // site: "bilibili",
      urlPattern: 'https://(.*).hdslb.com/(.*)@(.*).*',
      replace(e) {
        return e.split('@')[0];
      },
    },
    {
      // site: "站酷",
      urlPattern: 'https://img[.]zcool[.]cn/.*',
      replace(e) {
        return e.indexOf('?x-oss-process=') > -1
          ? `${e.split('?x-oss-process=')[0]}?x-oss-process=image/auto-orient,0/resize,m_lfit,w_3000`
          : e;
      },
    },
    {
      // site: "如室",
      urlPattern: 'res.rushi.net/(.*)',
      replace(e) {
        return e.includes('?x-oss-process=') ? e.split('?x-oss-process=')[0] : e;
      },
    },
    {
      // site: "众图网",
      urlPattern: 'https://imgpp.ztupic.com/(.*)',
      replace(e) {
        return e.includes('?x-oss-process=') ? e.split('?x-oss-process=')[0] : e;
      },
    },
    {
      // site: "堆糖",
      urlPattern: 'https://c-ssl.dtstatic.com/uploads/blog/(.*)',
      replace(e) {
        return e.replace('300_300_c', '1000_0');
      },
    },
    {
      // site: "享设计",
      urlPattern: 'https://imgs.design006.com/(.*)',
      replace(e) {
        return e.includes('?x-oss-process=') ? e.split('?x-oss-process=')[0] : e;
      },
    },
    {
      // site: "名师联智库",
      urlPattern: 'imgbig.mslzk.com/(.*)',
      replace(e) {
        return e.includes('jpg?imageView') ? e.split('?')[0] : e;
      },
    },
    {
      // site: "古田路9號",
      urlPattern: 'https://cdn[.]gtn9[.]com/.*',
      replace(e) {
        return e.indexOf('?x-oss-process=') > -1
          ? `${e.split('?x-oss-process=')[0]}?x-oss-process=image/auto-orient,0/resize,m_lfit,w_3000`
          : e;
      },
    },
    {
      // site: "Medium",
      urlPattern: 'https://cdn-images-[0-9][.]medium[.]com/.*',
      replace(e) {
        return e.replace(/\/max\/\d{2,4}/, '');
      },
    },
    {
      // site: "Artstation",
      urlPattern: 'https://cdn.*.artstation.com.*',
      replace(e) {
        return e
          .replace(/\d{14}\/small_square/, 'large')
          .replace(/\d{14}\/smaller_square/, 'large')
          .replace(/\d{14}\/micro_square/, 'large')
          .replace(/\/smaller_square/, '/large');
      },
    },
    {
      // site: "GameUI",
      urlPattern: 'https://image.gameuiux.cn.*',
      replace(e) {
        return e.replace(/_list/, '_detail');
      },
    },
    {
      // site: "interiordesign",
      urlPattern: 'https://d4qwptktddc5f[.]cloudfront[.]net/.*',
      replace(e) {
        return e.replace(/easy_thumbnails\/thumbs_/, '').replace(/[.]jpg.*/, '.jpg');
      },
    },
    {
      // site: "即刻",
      urlPattern: 'https://cdn[.]ruguoapp[.]com/.*',
      replace(e) {
        return e.split('?imageMogr2')[0];
      },
    },
    // 米画师
    {
      urlPattern: 'https://image-assets.mihuashi.com/*',
      replace(e) {
        const newSrc = e.replace(/\.large$/, '.detail');

        return newSrc;
      },
    },
  ],
};
