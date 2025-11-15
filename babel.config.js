module.exports = {
  presets: ['module:@react-native/babel-preset','nativewind/babel'],
  plugins: [ 
    ['module-resolver',
    {
      root: ['./src'], // 별칭 기준 경로
      alias: {
        '@': './src', // @ 를 src 폴더로 매핑
        '@assets': './assets',
        '@domain': './src/domain',
        '@shared': './src/shared',
        '@component': './src/shared/component',
        '@constant': './src/shared/constant',
        '@lib': './src/shared/lib',
        '@nav': './src/shared/nav',
        '@store': './src/shared/store',
        '@type': './src/shared/type',
        '@service': './src/shared/service',
      },
    }],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-worklets/plugin'// 무조건 마지막에 추가
  ],
};
