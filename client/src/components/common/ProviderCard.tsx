import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type IProvider } from "@/types/provider.types";

interface ProviderCardProps {
  provider: IProvider;
}

export const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={provider.userId.avatar} />
          <AvatarFallback>{provider.userId.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{provider.userId.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{provider.bio}</p>
        <div className="flex justify-between items-center">
          <Badge variant="outline">{provider.avgRating.toFixed(1)} ★</Badge>
          {provider.distanceKm && (
            <Badge variant="secondary">
              {provider.distanceKm.toFixed(1)} km away
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
