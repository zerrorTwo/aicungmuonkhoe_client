import React from "react";
import { Card } from "./card";
import { Button } from "./button";

type ChartCardProps = {
    title: string;
    onAdd?: () => void;
    addLabel?: string;
    children?: React.ReactNode;
};

export const ChartCard: React.FC<ChartCardProps> = ({ title, onAdd, addLabel = "Thêm", children }) => {
    return (
        <Card className="p-0 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-foreground">{title}</h3>
                {onAdd && (
                    <Button size="sm" variant="outline" className="h-8" onClick={onAdd}>
                        {addLabel}
                    </Button>
                )}
            </div>
            <div className="p-4">
                {children}
            </div>
            {!onAdd ? null : (
                <div className="px-4 py-3 border-t border-border/60 bg-muted/30 flex justify-end">
                    <Button size="sm" className="bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white" onClick={onAdd}>
                        {addLabel}
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default ChartCard;
