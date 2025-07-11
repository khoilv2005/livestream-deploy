import { Wrapper } from "./wrapper";
import { Toggle } from "./toggle";
import { Reconmended } from "./reconmended";
import { get } from "http";
import { getRecommendedService } from "@/lib/reconmended-service";
import { getUserFollowedUsers } from "@/lib/follow-service";
import {Following} from './following'

export const Sidebar = async() => {
    const reconmended = await getRecommendedService();
    const follows = await getUserFollowedUsers();

return (
    <Wrapper>
        <Toggle />
        <div className="space-y-4 pt-4 lg:pt-0">
            <Reconmended data={reconmended || []}/>
            <Following data={follows}  />
        </div>
    </Wrapper>

);
}

