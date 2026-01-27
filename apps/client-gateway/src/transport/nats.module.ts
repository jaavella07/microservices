import { Module } from '@nestjs/common';
import { envs, NATS_SERVICE } from '../config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ClientsModule.register([
            {
                name: NATS_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: envs.nats_servers
                }
            },
        ]),
    ],
    exports: [
        ClientsModule.register([
            {
                name: NATS_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: envs.nats_servers
                }
            },
        ]),
    ]
})
export class NatsModule {

}
