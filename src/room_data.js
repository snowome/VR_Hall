// 当前房间的路标数组
const GUIDE_POSTS = []

const TIMER = {
    // 到路标指定的房间时的相机移动Timer
    camera: null,
}

// 房间的6个面
const SIX_FACE = []

// 漫游数据
const ROAM = {
    // 是否正在漫游
    isRoaming: false,
    // 开始角度
    startDegree: 270,
    // 结束角度
    endDegree: 0,
    // 房间序号
    i: 0,
}

// 每个房间里的视频数据
const VIDEO_DATA = []

// 每一个房间的数据定义
const ROOM_DATA = {
    "room0": [
        {
            // 到房间的角度
            deg: 0,
            // 要到的房间
            toRoom: "room1",
            // 漫游时需要转的角度
            mandeg: 270,
            // 如果上一个房间漫游的角度大于当前房间的角度，reverse要置为true,否则为false
            reverse: false,
            // 地标位置
            position: {
                x: 0.6015032553134478,
                y: -43.74372552004664,
                z: -200 + 30
            }
        }
    ],
    "room1": [
        {
            deg: -180,
            toRoom: "room0",
            mandeg: 270 + 180,
            reverse: true,
            position: {
                x: -0.17486207415977262,
                y: -91.43211068189166,
                z: 200 - 30
            }
        },
        {
            deg: 88,
            toRoom: "room2",
            mandeg: 180,
            reverse: true,
            position: {
                x: -200 + 30,
                y: -63.77847120147063,
                z: 0.7914023907177943
            }
        },
        {
            deg: -88,
            toRoom: "room10",
            position: {
                x: 200 - 30,
                y: -66.00373404926036,
                z: 4.83201197220105
            }
        },
        {
            deg: -60,
            toRoom: "room8",
            position: {
                x: 199.99999999999997 - 30,
                y: -43.4543143486798,
                z: -110.80258589869673
            }
        }
    ],
    "room2": [
        {
            deg: -89,
            toRoom: "room1",
            position: {
                x: 200 - 30,
                y: -74.86957851527241,
                z: -3.880960393804159
            }
        },
        {
            deg: 111,
            toRoom: "room3",
            mandeg: 270 - 110,
            reverse: true,
            position: {
                x: -200 + 30,
                y: -64.16963772850595,
                z: 3.835985945982242
            }
        },
        {
            deg: 44,
            toRoom: "room4",
            position: {
                x: -155.04201589734612,
                y: -70.28634594140465,
                z: -199.99999999999994 + 30
            }
        }
    ],
    "room3": [
        {
            deg: -70,
            toRoom: "room2",
            position: {
                x: 199.99999999999994 - 30,
                y: -68.81231864194899,
                z: -19.44877519347105
            }
        },
        {
            deg: -10,
            toRoom: "room4",
            mandeg: 270 + 14,
            reverse: false,
            position: {
                x: 58.06451890453953,
                y: -68.7239666871113,
                z: -200 + 30
            }
        }
    ],
    "room4": [
        {
            deg: -139,
            toRoom: "room2",
            position: {
                x: 144.8800410706267,
                y: -87.26319877089207,
                z: 200.00000000000009 - 30
            }
        },
        {
            deg: 168,
            toRoom: "room3",
            position: {
                x: -41.997849896523974,
                y: -57.197834220453046,
                z: 200.00000000000006 - 30
            }
        },
        {
            deg: -29,
            toRoom: "room5",
            mandeg: 270 + 33,
            reverse: false,
            position: {
                x: 105.8913055429836,
                y: -74.77594096537854,
                z: -200 + 30
            },
        }
    ],
    "room5": [
        {
            deg: 146,
            toRoom: "room4",
            position: {
                x: -124.544071897257,
                y: -67.98846793465967,
                z: 199.99999999999997 - 30
            }
        },
        {
            deg: -111,
            toRoom: "room6",
            mandeg: 270 + 110,
            reverse: false,
            position: {
                x: 200.00000000000003 - 30,
                y: -58.69945079029148,
                z: 68.44694495132948
            }
        }
    ],
    "room6": [
        {
            deg: 68,
            toRoom: "room5",
            position: {
                x: -199.99999999999997 + 30,
                y: -53.48167508723918,
                z: -64.87764703783185
            }
        },
        {
            deg: -65,
            toRoom: "room7",
            mandeg: 270 + 69,
            reverse: true,
            position: {
                x: 199.99999999999997 - 30,
                y: -62.43899271986475,
                z: -70.23225374368569
            }
        }
    ],
    "room7": [
        {
            deg: 110,
            toRoom: "room6",
            position: {
                x: -199.99999999999994 + 30,
                y: -53.078666085491676,
                z: 54.31654111533162
            }
        },
        {
            deg: -168,
            toRoom: "room8",
            mandeg: 270 + 165,
            reverse: false,
            position: {
                x: 26.06340042170578,
                y: -70.296955065829,
                z: 200 - 30
            }
        }
    ],
    "room8": [
        {
            deg: 13,
            toRoom: "room7",
            position: {
                x: -46.66297191920702,
                y: -71.8418686897783,
                z: -200 + 30
            }
        },
        {
            deg: -145,
            toRoom: "room9",
            mandeg: 270 + 145,
            reverse: true,
            position: {
                x: 63.40423178179414,
                y: -70.42370102385881,
                z: 199.99999999999994 - 30
            }
        },
        {
            deg: -154,
            toRoom: "room10",
            position: {
                x: -131.6964185822796,
                y: -76.19983571489506,
                z: 199.99999999999997 - 30
            }
        },
        {
            deg: 122,
            toRoom: "room1",
            position: {
                x: -200.00000000000009 + 30,
                y: -42.1549629521446,
                z: 104.72907719871849
            }
        }
    ],
    "room9": [
        {
            deg: 35,
            toRoom: "room8",
            position: {
                x: -55.82128868626913,
                y: -73.37723806587306,
                z: -200 + 30
            }
        },
        {
            deg: 87,
            toRoom: "room10",
            mandeg: 270 + 180 + 89,
            reverse: false,
            position: {
                x: -200 + 30,
                y: -80.14264993539643,
                z: 5.791594926392531
            }
        }
    ],
    "room10": [
        {
            deg: -90,
            toRoom: "room9",
            position: {
                x: 200 - 30,
                y: -68.21903359949313,
                z: 0.3157896617820448
            }
        },
        {
            deg: -23,
            toRoom: "room8",
            position: {
                x: 144.94063162935765,
                y: -75.91358796392386,
                z: -200 + 30
            }
        },
        {
            deg: 87,
            toRoom: "room1",
            mandeg: 270 + 180 + 89,
            reverse: false,
            position: {
                x: -199.99999999999994 + 30,
                y: -69.09872725462222,
                z: 8.766490351817465
            }
        }
    ]
}

// 房间里的多媒体数据
const ROOM_MEDIA = {
    "room5": {
        mp4: [
            {
                // 视频url
                url: "video/video.mp4",
                // 在哪个面上
                face: "b",
                // 视频的左上角和右下角的坐标
                bounds: [
                    {
                        x: -90.80363223609503,
                        y: 66.8479001135073,
                        z: -199.99999999999997
                    },
                    {
                        x: 93.54143019296282,
                        y: -41.29511918274687,
                        z: -199.99999999999997
                    }
                ],
            },
            {
                url: "video/video.mp4",
                face: "l",
                bounds: [
                    {
                        x: -200.00000000000006,
                        y: 58.574142251008205,
                        z: 115.88021513504155
                    },
                    {
                        x: -200,
                        y: 21.208095885343425,
                        z: 52.093618655347655
                    }
                ],
            },
            {
                url: "video/video.mp4",
                face: "f",
                bounds: [
                    {
                        x: 92.77414715713908,
                        y: 73.33189320417439,
                        z: 200
                    },
                    {
                        x: 12.698170803942393,
                        y: 25.793385589371212,
                        z: 200
                    }
                ],
            },
            {
                url: "video/video.mp4",
                poster: "./img/poster.png",
                pauseIcon: "./img/pauseIcon.png",
                playIcon: "./img/playIcon.png",
                face: "r",
                bounds: [
                    {
                        x: 199.99999999999994,
                        y: 59.017388326554425,
                        z: -98.2591330937993
                    },
                    {
                        x: 200,
                        y: 21.286399025727565,
                        z: -34.46590463105802
                    }
                ],
            }
        ]
    },
}

export {ROOM_DATA, ROOM_MEDIA, GUIDE_POSTS, TIMER, SIX_FACE, ROAM, VIDEO_DATA}
