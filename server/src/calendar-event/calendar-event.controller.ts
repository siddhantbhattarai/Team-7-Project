import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateCalendarEventDto, UpdateCalendarEvent } from './dto/create-event.dto';

@Controller('calendar-event')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('Calendar-Event')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) {}

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Get all event' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateCalendarEventDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.calendarEventService.deleteEvent(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Get all event' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateCalendarEventDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateCalendarEvent: UpdateCalendarEvent) {
    return this.calendarEventService.updateEvent(id, updateCalendarEvent);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all event' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateCalendarEventDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.calendarEventService.getEvents();
  }

  @Post()
  @Roles('STAFF')
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateCalendarEventDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createCalendarEventDto: CreateCalendarEventDto) {
    return this.calendarEventService.createEvent(createCalendarEventDto);
  }
}
