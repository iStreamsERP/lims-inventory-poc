import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, CalendarDays, ChevronRight, ClockIcon } from "lucide-react";
import { Button } from "../ui/button";
function QuotationCards({
  cardtitle,
  badge,
  badgeClass,
  refdate,
  lastdate,
  description,
  itemcounts,
  onclicks,
}) {
  return (
    <div>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer p-2 ">
        <CardHeader className=" px-1 py-1">
          <div className="flex items-center gap-2 justify-between truncate">
            <CardTitle className="text-sm font-semibold truncate ">
              Quotation Ref No {cardtitle}
            </CardTitle>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${badgeClass}`}
            >
              {badge}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-1 py-1">
          <div className="grid ">
            <div className="flex items-center  justify-between">
              <div className="flex items-center text-[9px] font-semibold  text-gray-900">
                <CalendarDays className="mr-1 h-3 w-3" />
                <span>Ref Date: {refdate}</span>
              </div>
              <div className="flex items-center text-[9px] font-semibold  text-gray-900">
                <ClockIcon className="mr-1 h-3 w-3" />
                <span>Expires:{lastdate}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs">
                <Box className="mr-2 h-3 w-3 text-indigo-500" />
                <span className="font-medium">items {itemcounts}</span>
              </div>
              <div className={`text-xs font-medium  `}>{description}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex mt-2 flex-row justify-between bg-indigo-100 hover:bg-indigo-200 items-center text-xs w-full"
              onClick={onclicks}
            >
              View Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuotationCards;
