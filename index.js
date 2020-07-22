const { exec } = require('child_process');

const fs = require('fs');

const pkgVer = process.env['INPUT_BAZELISKVERSION'] || 'latest';

if (!/^[A-Z0-9a-z\-\+\.\^\~<>]+$/.test(pkgVer)) {
  console.error(`Invalid version \`${pkgVer}\``);
  process.exit(2);
  return;
}

const licenseText = fs.readFileSync(
  require('path').resolve(__dirname, 'LICENSE'),
  { encoding: 'UTF-8' });

console.log(licenseText);

function execStrict(cmd, cb) {
  exec(cmd, (error, stdout, stderr) => {
    if (stderr) {
      console.error(stderr);
    }
    console.log(stdout);
    if (error) {
      console.error(error.message);
      process.exit(1);
      return;
    }
    cb && cb();
  });
}

execStrict(`npm i -g @bazel/bazelisk@${pkgVer}`, () => {
  execStrict("which bazelisk && bazelisk --version", () => {
    execStrict("which bazel && bazel --version");
  });
});
