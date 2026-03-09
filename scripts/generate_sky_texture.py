from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


WIDTH = 4096
HEIGHT = 2048
OUTPUT = Path(__file__).resolve().parents[1] / 'public' / 'textures' / 'sky-panorama.png'


def lerp(a, b, t):
    return int(a + (b - a) * t)


def mix(c1, c2, t):
    return tuple(lerp(a, b, t) for a, b in zip(c1, c2))


def make_gradient():
    top = (72, 136, 229)
    upper = (95, 154, 238)
    middle = (131, 184, 245)
    lower = (184, 214, 248)
    horizon = (228, 239, 252)
    image = Image.new('RGB', (WIDTH, HEIGHT))
    pixels = image.load()

    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        if t < 0.28:
            color = mix(top, upper, t / 0.28)
        elif t < 0.62:
            color = mix(upper, middle, (t - 0.28) / 0.34)
        elif t < 0.84:
            color = mix(middle, lower, (t - 0.62) / 0.22)
        else:
            color = mix(lower, horizon, (t - 0.84) / 0.16)

        for x in range(WIDTH):
            pixels[x, y] = color

    return image


def add_radial_glow(base, center, radius, color, alpha, blur):
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(base, layer)


def add_cloud_cluster(base, ellipses, blur=26, shadow_shift=24):
    glow = Image.new('RGBA', base.size, (0, 0, 0, 0))
    shadow = Image.new('RGBA', base.size, (0, 0, 0, 0))
    core = Image.new('RGBA', base.size, (0, 0, 0, 0))

    glow_draw = ImageDraw.Draw(glow)
    shadow_draw = ImageDraw.Draw(shadow)
    core_draw = ImageDraw.Draw(core)

    for x, y, rx, ry, alpha in ellipses:
        glow_draw.ellipse(
            (x - rx * 1.15, y - ry * 1.12, x + rx * 1.15, y + ry * 1.12),
            fill=(245, 249, 255, int(alpha * 0.52)),
        )
        shadow_draw.ellipse(
            (x - rx * 0.98, y - ry * 0.78 + shadow_shift, x + rx * 0.98, y + ry * 1.02 + shadow_shift),
            fill=(176, 198, 230, int(alpha * 0.18)),
        )
        core_draw.ellipse((x - rx, y - ry, x + rx, y + ry), fill=(255, 255, 255, alpha))

    glow = glow.filter(ImageFilter.GaussianBlur(blur * 1.35))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    core = core.filter(ImageFilter.GaussianBlur(blur * 0.58))

    merged = Image.alpha_composite(glow, shadow)
    merged = Image.alpha_composite(merged, core)
    return Image.alpha_composite(base, merged)


def build_top_left_cluster():
    return [
        (40, 78, 560, 176, 255),
        (340, 120, 400, 156, 252),
        (650, 170, 270, 118, 242),
        (820, 220, 170, 82, 224),
        (230, 260, 240, 92, 220),
    ]


def build_center_cluster():
    return [
        (1945, 254, 120, 50, 178),
        (2120, 232, 150, 58, 194),
        (2290, 258, 118, 48, 174),
        (2140, 314, 104, 40, 158),
    ]


def build_top_right_cluster():
    return [
        (3370, 92, 240, 88, 232),
        (3645, 86, 390, 142, 255),
        (3950, 102, 250, 102, 248),
        (3590, 210, 260, 94, 226),
        (3915, 218, 178, 82, 214),
    ]


def build_horizon_bank(y, span_start, span_end, step, base_alpha):
    ellipses = []
    x = span_start
    index = 0

    while x <= span_end:
        rx = 88 + (index % 4) * 24
        ry = 26 + (index % 3) * 8
        alpha = base_alpha - (index % 5) * 8
        offset = (-16, 0, 14, 6)[index % 4]
        ellipses.append((x, y + offset, rx, ry, alpha))
        ellipses.append((x + rx * 0.55, y + offset + 16, rx * 0.56, ry * 0.8, max(alpha - 28, 110)))
        x += step
        index += 1

    return ellipses


def build_image():
    image = make_gradient().convert('RGBA')

    image = add_radial_glow(image, (2080, 240), 860, (160, 214, 255), 118, 150)
    image = add_radial_glow(image, (2080, 260), 470, (255, 255, 255), 70, 92)
    image = add_radial_glow(image, (2080, 960), 1500, (255, 255, 255), 38, 170)

    image = add_cloud_cluster(image, build_top_left_cluster(), blur=30, shadow_shift=28)
    image = add_cloud_cluster(image, build_center_cluster(), blur=24, shadow_shift=20)
    image = add_cloud_cluster(image, build_top_right_cluster(), blur=28, shadow_shift=24)

    image = add_cloud_cluster(
        image,
        [
            (360, 760, 170, 62, 188),
            (650, 820, 220, 68, 196),
            (980, 860, 150, 54, 178),
            (3050, 810, 210, 66, 186),
            (3380, 850, 170, 58, 176),
        ],
        blur=18,
        shadow_shift=16,
    )

    image = add_cloud_cluster(image, build_horizon_bank(988, 160, 3920, 245, 176), blur=18, shadow_shift=14)
    image = add_cloud_cluster(image, build_horizon_bank(1095, 360, 3780, 360, 128), blur=22, shadow_shift=18)

    haze = Image.new('RGBA', image.size, (0, 0, 0, 0))
    haze_draw = ImageDraw.Draw(haze)
    haze_draw.rectangle((0, 910, WIDTH, 1075), fill=(241, 247, 255, 90))
    haze = haze.filter(ImageFilter.GaussianBlur(52))
    image = Image.alpha_composite(image, haze)

    lower_lift = Image.new('RGBA', image.size, (0, 0, 0, 0))
    lower_draw = ImageDraw.Draw(lower_lift)
    lower_draw.rectangle((0, 1120, WIDTH, HEIGHT), fill=(124, 170, 236, 34))
    lower_lift = lower_lift.filter(ImageFilter.GaussianBlur(140))
    image = Image.alpha_composite(image, lower_lift)

    return image.convert('RGB')


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    build_image().save(OUTPUT, quality=95)
    print(OUTPUT)


if __name__ == '__main__':
    main()
