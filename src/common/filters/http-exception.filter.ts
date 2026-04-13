import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    constructor(private readonly prisma : PrismaService) {}

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() 
        : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException 
        ? exception.getResponse() : 'Internal server error';

        //! git commit -a -m "fix: Almacenamiento de logs"
        // Almacenar la información del error en la base de datos

        // --- SOLUCIÓN AL ERROR DE PRISMA CON LOS ARRAYS ---
        let finalErrorMessage = "Error desconocido";
        
        if (typeof message === 'string') {
            finalErrorMessage = message;
        } else {
            // Extraemos el mensaje (que podría ser un array de class-validator)
            const extractedMessage = (message as any).message || message;
            
            if (Array.isArray(extractedMessage)) {
                // Si es un arreglo, lo unimos en un solo texto separado por comas
                finalErrorMessage = extractedMessage.join(', ');
            } else if (typeof extractedMessage === 'string') {
                // Si ya es texto, lo dejamos igual
                finalErrorMessage = extractedMessage;
            } else {
                // Si es un objeto extraño, lo convertimos a string (JSON)
                finalErrorMessage = JSON.stringify(extractedMessage);
            }
        }

        const errorCode = (exception as any).code || 'UNKNOWN_ERROR';

        const user = request['users'];
        const sessionId = user && user.id ? user.id : null;

        try {
            await this.prisma.logs.create({
                data: {
                    statusCode: status,
                    timestamp: new Date(), 
                    path: request.url,
                    error: finalErrorMessage, // Usamos la variable ya convertida a texto seguro
                    errorCode: errorCode,
                    session_id: sessionId 
                }
            });
        } catch (dbError) {
            console.error("No se pudo guardar el log en la base de datos:", dbError);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),   
            path: request.url,
            error: finalErrorMessage, 
            errorCode: errorCode
        });
    }

}