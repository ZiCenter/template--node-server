import {Get, getMetadataArgsStorage, JsonController, UseBefore,} from 'routing-controllers';
import {routingControllersToSpec} from "routing-controllers-openapi";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const healthcheck = require("standard-healthcheck")

@JsonController()
export class HealthCheck {

    @Get('/health')
    @UseBefore(healthcheck({
        version: '1.0',
        description: 'My demo app',
        includeEnv: ['NODE_ENV']
    }))
    health() {return;}

    @Get('/swagger')
    swagger() {
        return routingControllersToSpec(getMetadataArgsStorage(), {})
    }

}
