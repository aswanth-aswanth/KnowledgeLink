import { Request, Response } from "express";
import formidable, { File as FormidableFile, Fields } from 'formidable';
import CreateRoadmap from "../../../../app/useCases/Roadmap/CreateRoadmap";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";
import { IRoadmap, IRectanglesData, IConnectionsData } from "../../../databases/interfaces/IRoadmap";

interface ParsedData {
    editorData: Omit<IRoadmap, 'creatorId'>;
    rectanglesData: IRectanglesData;
    connectionsData: IConnectionsData;
}

export default class CreateRoadmapController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const form = formidable({ multiples: true });

        return new Promise<Response>((resolve) => {
            form.parse(req, async (err, fields: Fields, files: formidable.Files) => {
                if (err) {
                    console.error(err);
                    return resolve(res.status(500).json({ error: 'Error parsing form data' }));
                }

                const createRoadmap = new CreateRoadmap(new RoadmapRepository());
                console.log("fields : ", fields);
                console.log("files : ", files);
                const creatorId = (req as any).user.userId;
                let parsedData: ParsedData;
                try {
                    const dataField = fields.data;
                    if (Array.isArray(dataField)) {
                        parsedData = JSON.parse(dataField[0]);
                    } else if (typeof dataField === 'string') {
                        parsedData = JSON.parse(dataField);
                    } else {
                        throw new Error('Invalid data field');
                    }
                } catch (error) {
                    console.error('Error parsing JSON data:', error);
                    return resolve(res.status(400).json({ error: 'Invalid JSON data' }));
                }

                const { editorData, rectanglesData, connectionsData } = parsedData;
                console.log("editorData : ", editorData);

                const roadmapData: IRoadmap = {
                    ...editorData,
                    creatorId,
                };

                // Filter out undefined values and ensure all elements are Files
                const fileArray: FormidableFile[] = Object.values(files)
                    .flat()
                    .filter((file): file is FormidableFile => file !== undefined);

                try {
                    const result = await createRoadmap.execute(roadmapData, rectanglesData, connectionsData, fileArray);
                    return resolve(res.status(201).json({
                        message: "Roadmap created successfully",
                        roadmapId: result._id
                    }));
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(`Error creating roadmap: ${err.message}`);
                        return resolve(res.status(400).json({ error: err.message }));
                    }
                    return resolve(res.status(400).json({ error: "Unknown error" }));
                }
            });
        });
    }
}