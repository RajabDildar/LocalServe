import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type IProvider } from "@/types/provider.types";

interface ProviderCardProps {
  provider: IProvider;
}

export const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Link to={`/provider/${provider._id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={provider.userId.avatar} />
            <AvatarFallback>{provider.userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle>{provider.userId.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-muted-foreground">{provider.bio}</p>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{provider.avgRating.toFixed(1)} ★</Badge>
            {provider.distanceKm !== undefined && (
              <Badge variant="secondary">
                {provider.distanceKm.toFixed(1)} km away
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
