const path = require("path");
const fs = require("fs");
const { VideoService } = require("./service");
const { VideoModuleService } = require("@video_module/service");

exports.Controller = class {
  static async create(req, res) {
    const { module_id } = req.body;

    if (!req.file) {
      return res.error(req.i18n.t("fileError"), 400);
    }

    const module = await VideoModuleService.getById({ id: module_id });
    if (!module) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await VideoService.create({
      ...req.body,
      file: req.file.filename,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const { page, limit, search, status, module_id } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await VideoService.get({
      offset,
      limit,
      search,
      status,
      module_id,
    });

    if (module_id) {
      const module = await VideoModuleService.getById({ id: module_id });
      if (!module) {
        return res.error(req.i18n.t("docNotFound"), 404);
      }
    }

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const id = req.params.id;

    const data = await VideoService.getById({ id }, true);
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async getWatch(req, res) {
    const id = req.params.id;

    const data = await VideoService.getById({ id }, true);
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const videoPath = path.join(
      __dirname,
      `../../../public/uploads/videos/${data.file}`
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
      const CHUNK_SIZE = 2 * 1024 * 1024;
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

  static async update(req, res) {
    const { module_id } = req.body;
    const id = req.params.id;

    const old_data = await VideoService.getById({ id });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const module = await VideoModuleService.getById({ id: module_id });
    if (!module) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await VideoService.update({
      ...req.body,
      id,
      file: req.file.filename,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const id = req.params.id;

    const old_data = await VideoService.getById({ id });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await VideoService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
