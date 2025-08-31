import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { MissionModel } from '@/models/mission-schema';

export type MissionKanbanItem = {
  id: string;
  name: string;
  column: string;
  data: MissionModel;
};

interface RapportsListProps {
  missions: MissionKanbanItem[];
  getStatusBadge: (status: string) => React.ReactNode;
}

export function ReportList({ missions, getStatusBadge }: RapportsListProps) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Liste des missions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mission</TableHead>
              <TableHead>Chef d&apos;équipe</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Agents</TableHead>
              <TableHead>Marchés</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => {
              const missionData = mission.data as MissionModel;
              return (
                <TableRow key={mission.id}>
                  <TableCell className="font-medium">#{missionData.missionNumber}</TableCell>
                  <TableCell>
                    {missionData.teamLeader.name}
                  </TableCell>
                  <TableCell>{missionData.location}</TableCell>
                  <TableCell>{missionData.startDate.toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{missionData.agentCount}</TableCell>
                  <TableCell>{missionData.marketCount}</TableCell>
                  <TableCell>{getStatusBadge(missionData.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/missions/${missionData.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/missions/${missionData.id}/modifier`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
