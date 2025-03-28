const { VideoService } = require("@video/service");
const path = require("path");
const fs = require("fs");

exports.Controller = class {
  static async getWatch(req, res) {
    const id = req.params.id;

    const data = await VideoService.getById({ id }, true);
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const videoPath = path.join(
      __dirname,
      `../../public/uploads/videos/${data.file}`
    );

    const stat = fs.statSync(videoPath);

    const fileSize = stat.size;

    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fileStream = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      fileStream.pipe(res);
    } else {
      // Agar Range header bo‘lmasa, faqat 2MB ni jo‘natamiz
      const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
      const start = 0;
      const end = Math.min(CHUNK_SIZE - 1, fileSize - 1);
      const chunkSize = end - start + 1;

      const fileStream = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      fileStream.pipe(res);
    }
  }
};
