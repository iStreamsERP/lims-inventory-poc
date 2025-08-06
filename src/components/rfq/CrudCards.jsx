import { Card, CardHeader, CardTitle } from "@/components/ui/card";
function CrudCards({ onclick, cardtitle, color, textcolor, Icon }) {
  return (
    <div>
      <Card className={`rounded-lg ${color} `} onClick={onclick}>
        <CardHeader
          className={`flex ${textcolor} flex-row items-center justify-between px-1 py-1`}
        >
          <CardTitle className="text-sm font-medium ">{cardtitle}</CardTitle>
          {Icon && <Icon className={`h-5 w-5 ${textcolor}`} />}
        </CardHeader>
      </Card>
    </div>
  );
}

export default CrudCards;
